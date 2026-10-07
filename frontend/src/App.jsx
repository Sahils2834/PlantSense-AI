import React, { useState, useEffect, useRef } from 'react';
import './App.css';

import { Header }               from './components/dashboard/Header';
import { StatsBar }             from './components/dashboard/StatsBar';
import { Sidebar }              from './components/dashboard/Sidebar';
import { StreamView }           from './components/dashboard/StreamView';
import { ReportsModal }         from './components/dashboard/ReportsModal';
import { AnalysisPane }         from './components/diagnosis/AnalysisPane';
import { ChatPane }             from './components/diagnosis/ChatPane';
import { FarmerContextDrawer }  from './components/diagnosis/FarmerContextDrawer';
import { ImageUploadView }      from './components/diagnosis/ImageUploadView';
import { VideoUploadView }      from './components/diagnosis/VideoUploadView';
import { t }                    from './i18n';

const API = 'http://127.0.0.1:8000/api/v1';

function App() {
  const videoRef   = useRef(null);
  const canvasRef  = useRef(null);
  const intervalRef = useRef(null);
  const analyzingRef = useRef(false);

  // UI state
  const [sidebarOpen, setSidebarOpen]   = useState(false);
  const [activeTab, setActiveTab]       = useState('camera');
  const [rightTab, setRightTab]         = useState('analysis');
  const [selectedLang, setSelectedLang] = useState('en');
  const [reportsModalOpen, setReportsModalOpen] = useState(false);

  // System Health
  const [healthStatus, setHealthStatus] = useState(null);
  const [modelStatus, setModelStatus]   = useState(null);

  // Camera
  const [cameraDevices, setCameraDevices]     = useState([]);
  const [selectedCamera, setSelectedCamera]   = useState('');
  const [cameraStream, setCameraStream]       = useState(null);
  const [isCameraRunning, setIsCameraRunning] = useState(false);
  const [cameraMsg, setCameraMsg]             = useState('');
  const [cameraError, setCameraError]         = useState('');

  // Video
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState(null);

  // Detection
  const [isAnalyzing, setIsAnalyzing]       = useState(false);
  const [currentResult, setCurrentResult]   = useState(null);
  const [diseaseAlerts, setDiseaseAlerts]   = useState([]);
  const [stats, setStats]                   = useState({ critical_alerts: 0, total_detections: 0 });

  // GenAI
  const [analysisData, setAnalysisData]         = useState(null);
  const [isAnalyzingGenAI, setIsAnalyzingGenAI] = useState(false);
  const [chatHistory, setChatHistory]           = useState([]);
  const [isSendingChat, setIsSendingChat]       = useState(false);

  // Farmer context
  const [farmerContext, setFarmerContext] = useState({ crop:'', location:'', growthStage:'', weather:'', irrigation:'' });

  // ── Init & Health Check ──
  useEffect(() => {
    checkHealth();
    fetchModelStatus();
    fetchStats();
    fetchAlerts();
    scanCameras(false);

    const healthInterval = setInterval(() => {
      checkHealth();
      fetchModelStatus();
    }, 15000);

    return () => {
      stopTracks();
      clearInterval(intervalRef.current);
      clearInterval(healthInterval);
    };
  }, []);

  // When language changes, re-fetch AI analysis in new language if valid disease exists
  useEffect(() => {
    if (currentResult?.disease && currentResult?.is_plant !== false && !currentResult?.disease?.toLowerCase().includes('no supported plant')) {
      fetchGenAI(currentResult, selectedLang, farmerContext);
    }
  }, [selectedLang]);

  // ── API Helpers ──
  const checkHealth = async () => {
    try {
      const r = await fetch(`${API}/health`);
      if (r.ok) setHealthStatus(await r.json());
      else setHealthStatus({ backend: true, models: false, llm: false });
    } catch {
      setHealthStatus({ backend: false, models: false, llm: false });
    }
  };

  const fetchModelStatus = async () => {
    try {
      const r = await fetch(`${API}/models/status`);
      if (r.ok) setModelStatus(await r.json());
    } catch {}
  };

  const fetchStats = async () => {
    try {
      const r = await fetch(`${API}/detections/stats`);
      if (r.ok) {
        const d = await r.json();
        if (d.stats) setStats(d.stats);
      }
    } catch {}
  };

  const fetchAlerts = async () => {
    try {
      const r = await fetch(`${API}/detections/recent?limit=30`);
      if (r.ok) {
        const d = await r.json();
        if (d.recent_alerts) setDiseaseAlerts(d.recent_alerts);
      }
    } catch {}
  };

  const handleClearHistory = async () => {
    try {
      await fetch(`${API}/detections/clear`, { method: 'DELETE' });
    } catch {}
    setDiseaseAlerts([]);
    setStats(prev => ({ ...prev, critical_alerts: 0, total_detections: 0 }));
  };

  const fetchGenAI = async (res, lang, ctx) => {
    if (!res?.disease || res?.is_plant === false || res?.disease?.toLowerCase().includes('no supported plant')) {
      setAnalysisData(null);
      return;
    }
    setIsAnalyzingGenAI(true);
    try {
      const r = await fetch(`${API}/ai/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          disease: res.disease,
          confidence: res.confidence || 0.95,
          severity: res.severity || 'Moderate',
          language: lang,
          farmer_context: ctx
        })
      });
      if (r.ok) setAnalysisData(await r.json());
    } catch {
      setAnalysisData(null);
    } finally {
      setIsAnalyzingGenAI(false);
    }
  };

  // ── Camera ──
  const scanCameras = async (reqPermission = true) => {
    setCameraError('');
    setCameraMsg('');
    try {
      if (reqPermission && navigator.mediaDevices?.getUserMedia) {
        try {
          const s = await navigator.mediaDevices.getUserMedia({ video: true });
          s.getTracks().forEach(t => t.stop());
        } catch {}
      }
      if (!navigator.mediaDevices?.enumerateDevices) {
        setCameraError('Camera enumeration not supported.');
        return;
      }
      const devs = await navigator.mediaDevices.enumerateDevices();
      const vids = devs.filter(d => d.kind === 'videoinput');
      setCameraDevices(vids);
      if (vids.length > 0) {
        setSelectedCamera(vids[0].deviceId);
        setCameraMsg(`Found ${vids.length} camera(s).`);
      } else {
        setCameraMsg(t(selectedLang, 'noCamerasFound'));
      }
    } catch (e) {
      setCameraError('Scan error: ' + e.message);
    }
  };

  const stopTracks = () => {
    cameraStream?.getTracks().forEach(t => t.stop());
    setCameraStream(null);
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks?.()?.forEach(t => t.stop());
      videoRef.current.srcObject = null;
    }
  };

  const stopCamera = () => {
    stopTracks();
    setIsCameraRunning(false);
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  const startCamera = async () => {
    setCameraError('');
    if (uploadedVideoUrl) {
      URL.revokeObjectURL(uploadedVideoUrl);
      setUploadedVideoUrl(null);
    }
    // Clear old detection on starting fresh stream
    setCurrentResult(null);
    setAnalysisData(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: selectedCamera ? { deviceId: { exact: selectedCamera } } : true
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
      setIsCameraRunning(true);
      intervalRef.current = setInterval(captureFrame, 800);
    } catch (e) {
      setCameraError('Cannot access camera: ' + e.message);
    }
  };

  const captureFrame = async () => {
    if (analyzingRef.current) return;
    const v = videoRef.current;
    if (!v || v.paused || v.ended || v.readyState < 2) return;
    analyzingRef.current = true;
    setIsAnalyzing(true);
    try {
      const c = document.createElement('canvas');
      c.width = v.videoWidth || 640;
      c.height = v.videoHeight || 480;
      c.getContext('2d').drawImage(v, 0, 0, c.width, c.height);
      c.toBlob(async blob => {
        if (!blob) {
          analyzingRef.current = false;
          setIsAnalyzing(false);
          return;
        }
        try {
          const fd = new FormData();
          fd.append('file', blob, 'frame.jpg');
          const r = await fetch(`${API}/diagnosis/frame`, { method: 'POST', body: fd });
          if (r.ok) {
            const data = await r.json();
            setCurrentResult(data);
            if (data.is_plant !== false && data.disease && !analysisData) {
              fetchGenAI(data, selectedLang, farmerContext);
            }
            if (data.is_plant !== false && data.disease && !data.disease.toLowerCase().includes('healthy')) {
              setDiseaseAlerts(prev => [{ id: Date.now(), ...data }, ...prev.slice(0, 29)]);
              fetchStats();
            }
          }
        } catch {} finally {
          analyzingRef.current = false;
          setIsAnalyzing(false);
        }
      }, 'image/jpeg', 0.85);
    } catch {
      analyzingRef.current = false;
      setIsAnalyzing(false);
    }
  };

  // ── Image Upload ──
  const handleImageDiagnose = async (file) => {
    if (isCameraRunning) stopCamera();
    setCurrentResult(null);
    setAnalysisData(null);
    setIsAnalyzing(true);

    try {
      const fd = new FormData();
      fd.append('file', file);
      const r = await fetch(`${API}/diagnosis/frame`, { method: 'POST', body: fd });
      if (r.ok) {
        const data = await r.json();
        setCurrentResult(data);
        if (data.is_plant !== false && data.disease && !data.disease.toLowerCase().includes('no supported plant')) {
          fetchGenAI(data, selectedLang, farmerContext);
          if (!data.disease.toLowerCase().includes('healthy')) {
            setDiseaseAlerts(prev => [{ id: Date.now(), ...data }, ...prev.slice(0, 29)]);
            fetchStats();
          }
        }
      }
    } catch {} finally {
      setIsAnalyzing(false);
    }
  };

  // ── Video Upload ──
  const handleUploadVideo = async (file) => {
    if (isCameraRunning) stopCamera();
    setCurrentResult(null);
    setAnalysisData(null);

    try {
      const fd = new FormData();
      fd.append('file', file);
      const r = await fetch(`${API}/video/analyze`, { method: 'POST', body: fd });
      if (r.ok) {
        const d = await r.json();
        if (d.success) {
          const videoRes = {
            success: true,
            is_plant: d.is_plant !== false,
            disease: d.primary_disease,
            plant: d.plant,
            confidence: d.max_confidence || d.avg_confidence || 0.90,
            severity: d.severity || 'Moderate',
            affected_area_percent: d.affected_percent || 0.0,
            model_agreement: { models_agreeing: 3, total_models: 3, agreement_str: '3/3' }
          };
          setCurrentResult(videoRes);
          if (d.is_plant !== false && d.primary_disease && !d.primary_disease.toLowerCase().includes('no supported plant')) {
            fetchGenAI(videoRes, selectedLang, farmerContext);
            if (!d.primary_disease.toLowerCase().includes('healthy')) {
              setDiseaseAlerts(prev => [{ id: Date.now(), ...videoRes }, ...prev.slice(0, 29)]);
              fetchStats();
            }
          }
          return d;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  };

  // ── Chat / Ask AI ──
  const handleSendMessage = async (msg) => {
    if (!msg) return;
    const userMsg = {
      role: 'user',
      content: msg,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatHistory(p => [...p, userMsg]);
    setIsSendingChat(true);

    try {
      const r = await fetch(`${API}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: msg,
          disease_context: currentResult?.is_plant !== false ? currentResult?.disease || null : null,
          confidence: currentResult?.confidence || null,
          language: selectedLang,
          farmer_context: farmerContext,
          chat_history: chatHistory.map(m => ({ role: m.role, content: m.content }))
        })
      });
      if (r.ok) {
        const d = await r.json();
        setChatHistory(p => [
          ...p,
          {
            role: 'assistant',
            content: d.reply || '...',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    } catch {
      setChatHistory(p => [
        ...p,
        {
          role: 'assistant',
          content: 'Unable to connect to AI assistant.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsSendingChat(false);
    }
  };

  const isStreamActive = isCameraRunning || !!uploadedVideoUrl;

  const centerFooterStatus = () => {
    if (isAnalyzing) return { text: `⚡ ${t(selectedLang, 'analyzing')}`, cls: 'analyzing' };
    if (isStreamActive) return { text: t(selectedLang, 'samplingFps'), cls: 'live' };
    return { text: t(selectedLang, 'readyForInput'), cls: '' };
  };
  const foot = centerFooterStatus();

  return (
    <div className="ps-app">
      {/* Navigation Header */}
      <Header
        healthStatus={healthStatus}
        modelStatus={modelStatus}
        selectedLanguage={selectedLang}
        onLanguageChange={setSelectedLang}
        onMenuToggle={() => setSidebarOpen(o => !o)}
        activeNavTab="dashboard"
        onNavTabChange={tab => {
          if (tab === 'inspections' || tab === 'reports') {
            setReportsModalOpen(true);
          }
        }}
      />

      {/* Global Statistics Bar */}
      <StatsBar
        stats={stats}
        isStreamActive={isStreamActive}
        selectedLanguage={selectedLang}
      />

      {/* Body Area */}
      <div className="ps-body">
        {/* Left Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          selectedLanguage={selectedLang}
          activeTab={activeTab}
          setActiveTab={t => {
            setActiveTab(t);
            setSidebarOpen(false);
          }}
          cameraDevices={cameraDevices}
          selectedCamera={selectedCamera}
          setSelectedCamera={setSelectedCamera}
          isCameraRunning={isCameraRunning}
          onStartCamera={startCamera}
          onStopCamera={stopCamera}
          onScanCameras={() => scanCameras(true)}
          onUploadVideo={handleUploadVideo}
          onUploadImage={handleImageDiagnose}
          cameraCountMessage={cameraMsg}
          cameraError={cameraError}
          alerts={diseaseAlerts}
          onClearHistory={handleClearHistory}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Center Canvas / Media Workspace */}
        <div className="ps-center">
          {activeTab === 'camera' && (
            <>
              <StreamView
                videoRef={videoRef}
                canvasRef={canvasRef}
                isCameraRunning={isCameraRunning}
                uploadedVideoUrl={uploadedVideoUrl}
                currentResult={currentResult}
                isAnalyzing={isAnalyzing}
                onVideoEnded={() => {
                  clearInterval(intervalRef.current);
                  intervalRef.current = null;
                }}
                selectedLanguage={selectedLang}
              />
              <div className="ps-center-footer">
                <span className={`ps-footer-status ${foot.cls}`}>{foot.text}</span>
                {currentResult && currentResult.is_plant !== false && (
                  <span className="ps-footer-meta">
                    {t(selectedLang, 'lastDetection')}: <strong>{currentResult.disease}</strong> · {Math.round((currentResult.confidence || 0) * 100)}%
                  </span>
                )}
              </div>
            </>
          )}

          {activeTab === 'image' && (
            <ImageUploadView
              onImageDiagnose={handleImageDiagnose}
              isAnalyzing={isAnalyzing}
              selectedLanguage={selectedLang}
              onClearImage={() => {
                setCurrentResult(null);
                setAnalysisData(null);
              }}
            />
          )}

          {activeTab === 'video' && (
            <VideoUploadView
              onUploadVideo={handleUploadVideo}
              isAnalyzing={isAnalyzing}
              selectedLanguage={selectedLang}
              onClearVideo={() => {
                setCurrentResult(null);
                setAnalysisData(null);
              }}
            />
          )}

          {/* Farmer Context Drawer */}
          <FarmerContextDrawer
            farmerContext={farmerContext}
            onContextChange={setFarmerContext}
            selectedLanguage={selectedLang}
          />
        </div>

        {/* Right AI Diagnostics & Assistant Panel */}
        <div className="ps-right">
          <div className="ps-right-tabs">
            <button
              className={`ps-right-tab ${rightTab === 'analysis' ? 'active' : ''}`}
              onClick={() => setRightTab('analysis')}
            >
              🤖 {t(selectedLang, 'aiAnalysis')}
            </button>
            <button
              className={`ps-right-tab ${rightTab === 'chat' ? 'active' : ''}`}
              onClick={() => setRightTab('chat')}
            >
              💬 {t(selectedLang, 'askAI')}
            </button>
          </div>

          <div className="ps-right-body">
            {rightTab === 'analysis' && (
              <AnalysisPane
                result={currentResult}
                analysisData={analysisData}
                isLoading={isAnalyzingGenAI}
                selectedLanguage={selectedLang}
              />
            )}
            {rightTab === 'chat' && (
              <ChatPane
                currentResult={currentResult}
                chatHistory={chatHistory}
                onSendMessage={handleSendMessage}
                onClearChat={() => setChatHistory([])}
                isSending={isSendingChat}
                selectedLanguage={selectedLang}
              />
            )}
          </div>
        </div>
      </div>

      {/* Reports & Inspections Modal */}
      <ReportsModal
        isOpen={reportsModalOpen}
        onClose={() => setReportsModalOpen(false)}
        selectedLanguage={selectedLang}
        alerts={diseaseAlerts}
        stats={stats}
        modelStatus={modelStatus}
      />
    </div>
  );
}

export default App;