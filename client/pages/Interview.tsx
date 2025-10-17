import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Metric from "@/components/interview/Metric";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth, InterviewResult } from "@/context/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";

import { toast } from "sonner";

function refineText(t: string) {
  let s = t.replace(/\s+/g, " ").trim();
  s = s.replace(/\bi\b/g, "I");
  s = s.replace(/\s([,.!?;:])/g, "$1");
  if (!/[.!?]$/.test(s)) s += ".";
  s = s.replace(/\.(\w)/g, ". $1");
  return s;
}

function useSpeech() {
  const [supported, setSupported] = useState<boolean>(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState<string>("");
  const [fillerCount, setFillerCount] = useState<number>(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [words, setWords] = useState<number>(0);

  const recRef = useRef<any>(null);
  const finalRef = useRef<string>("");
  const interimRef = useRef<string>("");

  useEffect(() => {
    const SR: any =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (SR) setSupported(true);
  }, []);

  const start = () => {
    const SR: any =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SR) {
      toast.error("Speech recognition not supported in this browser.");
      return;
    }
    const rec = new SR();
    try {
      rec.maxAlternatives = 3;
    } catch {}
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";
    rec.onresult = (e: any) => {
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const result = e.results[i];
        const txt = String(result[0]?.transcript || "");
        if (result.isFinal) {
          const refined = refineText(txt);
          finalRef.current = (finalRef.current + " " + refined).trim();
          interimRef.current = "";
          const tokens = refined.toLowerCase().split(/\s+/g).filter(Boolean);
          const fillers = ["um", "uh", "like", "you know", "erm", "hmm"];
          const count = tokens.filter((t) => fillers.includes(t)).length;
          setFillerCount((c) => c + count);
          setWords((w) => w + tokens.length);
        } else {
          interimRef.current = txt;
        }
      }
      setTranscript(
        (finalRef.current + (interimRef.current ? " " + interimRef.current : "")).trim(),
      );
    };
    rec.onerror = () => {
      toast.error("Speech recognition error");
    };
    rec.onend = () => setListening(false);
    rec.start();
    recRef.current = rec;
    setListening(true);
    setStartTime(Date.now());
  };

  const stop = () => {
    try {
      recRef.current?.stop?.();
    } catch {}
    setListening(false);
  };

  const reset = () => {
    finalRef.current = "";
    interimRef.current = "";
    setTranscript("");
    setFillerCount(0);
    setStartTime(Date.now());
    setWords(0);
  };

  const paceWpm = useMemo(() => {
    if (!startTime) return 0;
    const mins = (Date.now() - startTime) / 60000;
    if (mins <= 0) return 0;
    return Math.round(words / mins);
  }, [startTime, words]);

  return {
    supported,
    listening,
    transcript,
    fillerCount,
    paceWpm,
    start,
    stop,
    reset,
  } as const;
}

export default function Interview() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioDataRef = useRef<Uint8Array | null>(null);
  const [running, setRunning] = useState(false);

  const [type, setType] = useState("technical");
  const [domain, setDomain] = useState("Software Development");
  const [count, setCount] = useState(3);
  const [difficulty, setDifficulty] = useState("Mixed");
  const [mode, setMode] = useState("practice");
  const [timePerQ, setTimePerQ] = useState(120);
  const [deviceOK, setDeviceOK] = useState(false);

  const [posture, setPosture] = useState(50);
  const [headStability, setHeadStability] = useState(50);
  const [gestureActivity, setGestureActivity] = useState(50);
  const [engagement, setEngagement] = useState(50);
  const [volume, setVolume] = useState(0);
  const {
    supported: speechSupported,
    listening,
    transcript,
    fillerCount,
    paceWpm,
    start: startSpeech,
    stop: stopSpeech,
    reset: resetSpeech,
  } = useSpeech();

  const [camActive, setCamActive] = useState(false);
  const [micActive, setMicActive] = useState(false);

  const questionBank: Record<string, string[]> = {
    "Software Development": [
      "Explain the difference between concurrency and parallelism.",
      "Describe how you would design a rate limiter.",
      "What are the trade-offs of microservices vs monoliths?",
      "How does HTTP/2 differ from HTTP/1.1?",
      "What is eventual consistency and when to use it?",
    ],
    "Data Science": [
      "How do you handle class imbalance?",
      "Explain bias-variance tradeoff.",
      "Walk through a typical ML pipeline.",
      "How to select evaluation metrics for regression tasks?",
      "Feature selection techniques and when to use them?",
    ],
    "Machine Learning": [
      "When would you use CNNs vs RNNs?",
      "Explain regularization techniques.",
      "How do you prevent overfitting?",
      "What is gradient vanishing/exploding?",
      "Compare batch vs stochastic gradient descent.",
    ],
    DevOps: [
      "Explain CI/CD and its benefits.",
      "What is infrastructure as code?",
      "How do you design a blue/green deployment?",
    ],
    Cloud: [
      "Compare IaaS, PaaS, and SaaS.",
      "Design a multi-region architecture in the cloud.",
      "Cost optimization strategies in cloud workloads.",
    ],
    Cybersecurity: [
      "Explain OWASP Top 10.",
      "What is zero-trust architecture?",
      "How do you prevent SQL injection and XSS?",
    ],
    HR: [
      "Describe effective behavioral interviewing.",
      "How do you handle conflict mediation?",
      "What metrics matter in talent acquisition?",
    ],
    Sales: [
      "Walk me through your sales funnel.",
      "How do you qualify leads?",
      "Objection handling strategies.",
    ],
    Finance: [
      "Explain NPV vs IRR.",
      "How do you evaluate credit risk?",
      "What is duration and convexity?",
    ],
    Marketing: [
      "Describe A/B testing for campaigns.",
      "How do you build a brand strategy?",
      "Key metrics for digital marketing.",
    ],
    "Civil Engineering": [
      "Explain load-bearing vs framed structures.",
      "Soil testing methods and importance.",
      "Bridge design considerations.",
    ],
    Mechanical: [
      "Thermodynamics laws in practice.",
      "Explain different heat exchangers.",
      "Preventive vs predictive maintenance.",
    ],
    Electrical: [
      "AC vs DC and use cases.",
      "Protective relays and coordination.",
      "Power factor correction methods.",
    ],
    Product: [
      "Define and measure product-market fit.",
      "Roadmap prioritization frameworks.",
      "Writing effective PRDs.",
    ],
    Design: [
      "Explain visual hierarchy principles.",
      "UX research methods and trade-offs.",
      "Design systems: benefits and challenges.",
    ],
    Support: [
      "Handling critical incidents.",
      "Building a knowledge base.",
      "CSAT vs NPS: differences and use.",
    ],
    Operations: [
      "Lean vs Six Sigma.",
      "Capacity planning approach.",
      "Supply chain risk mitigation.",
    ],
    Healthcare: [
      "HIPAA implications in practice.",
      "Care pathway optimization.",
      "Outcome tracking and reporting.",
    ],
    Biotech: [
      "Explain CRISPR basics.",
      "Clinical trial phases and goals.",
      "Bioprocess scale-up challenges.",
    ],
    Energy: [
      "Grid stability and renewables integration.",
      "Battery storage technologies.",
      "Demand response mechanisms.",
    ],
    "Product Management": [
      "How do you validate problem-solution fit?",
      "Prioritization: RICE vs MoSCoW—when to use which?",
      "Define product success metrics for a new feature.",
      "How to run effective user research and synthesize insights?",
      "Go-to-market plan for a 0→1 product.",
    ],
    "System Design": [
      "Design a URL shortener end-to-end.",
      "Design a news feed with ranking.",
      "Scale a chat service to millions of users.",
      "Design a rate limiter for an API gateway.",
      "Design a real-time analytics system.",
    ],
    "DevOps & Cloud": [
      "Design a GitOps workflow for multi-env deployments.",
      "Blue/green vs canary—trade-offs and tooling.",
      "Implement observability: logs, metrics, traces.",
      "Kubernetes multi-tenant cluster hardening.",
      "Disaster recovery strategy with RPO/RTO targets.",
    ],
    "Digital Marketing": [
      "Full-funnel strategy for a SaaS product.",
      "Set up and interpret an A/B test for a landing page.",
      "Attribution models: pros and cons.",
      "Content strategy for organic growth.",
      "Building a marketing analytics dashboard.",
    ],
    "Finance & Banking": [
      "Credit risk modeling approaches.",
      "ALM: duration gap and interest-rate risk.",
      "Design a fraud detection pipeline.",
      "Capital budgeting: NPV vs IRR caveats.",
      "Basel III implications on lending.",
    ],
    "Healthcare Tech": [
      "Design a HIPAA-compliant telehealth system.",
      "FHIR vs HL7—interoperability considerations.",
      "Patient outcomes measurement and analytics.",
      "EHR integration challenges and solutions.",
      "Remote patient monitoring architecture.",
    ],
    "Sales & BD": [
      "Lead qualification frameworks (BANT/MEDDIC).",
      "Build a repeatable outbound motion.",
      "Pricing and packaging strategy for enterprise.",
      "Design a win-loss analysis process.",
      "Forecasting accuracy—methods and pitfalls.",
    ],
    "Operations Management": [
      "Capacity planning for seasonal demand.",
      "Design an SLA/SLO framework.",
      "Lean improvements in a warehouse process.",
      "Supplier risk assessment methodology.",
      "Queueing theory applications in ops.",
    ],
    Consulting: [
      "Structure a profitability case.",
      "Market sizing: top-down vs bottom-up.",
      "MECE and issue trees—apply to a retail case.",
      "Build a recommendation with risks and next steps.",
      "Stakeholder alignment in ambiguous projects.",
    ],
    "Startup & Entrepreneurship": [
      "Find and validate a beachhead market.",
      "Design an MVP and success metrics.",
      "Fundraising narrative and key milestones.",
      "Build a growth loop for a new product.",
      "Hiring plan for the first 10 employees.",
    ],
  };

  const questions = useMemo(() => {
    const bank = questionBank[domain] || questionBank["Software Development"];
    return bank.slice(0, Math.max(1, Math.min(count, bank.length)));
  }, [domain, count]);

  const [qIndex, setQIndex] = useState(0);
  const [perQ, setPerQ] = useState<
    { question: string; transcript: string; score: number; feedback: string }[]
  >([]);

  const { addSession } = useAuth();
  const allTranscriptRef = useRef<string>("");
  const nav = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const incoming = searchParams.get("domain");
    if (incoming) {
      const d = decodeURIComponent(incoming);
      const exact = Object.keys(questionBank).find((k) => k.toLowerCase() === d.toLowerCase());
      const partial = exact || Object.keys(questionBank).find((k) => k.toLowerCase().includes(d.toLowerCase()));
      if (partial) setDomain(partial);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [result, setResult] = useState<InterviewResult | null>(null);

  const lastFrameRef = useRef<ImageData | null>(null);
  const motionEMARef = useRef<number>(0);

  useEffect(() => {
    setQIndex(0);
    setPerQ([]);
    allTranscriptRef.current = "";
    resetSpeech();
  }, [domain]);

  const tick = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const w = 160;
    const h = Math.round((video.videoHeight / video.videoWidth) * w) || 90;
    canvas.width = w;
    canvas.height = h;
    ctx.drawImage(video, 0, 0, w, h);
    const frame = ctx.getImageData(0, 0, w, h);

    if (lastFrameRef.current) {
      let diff = 0;
      const a = frame.data;
      const b = lastFrameRef.current.data;
      for (let i = 0; i < a.length; i += 4) {
        const g1 = (a[i] + a[i + 1] + a[i + 2]) / 3;
        const g2 = (b[i] + b[i + 1] + b[i + 2]) / 3;
        diff += Math.abs(g1 - g2);
      }
      const norm = diff / (w * h);
      motionEMARef.current = motionEMARef.current * 0.9 + norm * 0.1;
      const motion = motionEMARef.current;

      const head = Math.max(0, Math.min(100, 100 - motion / 2));
      const gesture = Math.max(0, Math.min(100, motion / 2));
      setHeadStability(Math.round(head));
      setGestureActivity(Math.round(gesture));

      let centerSum = 0;
      let ccount = 0;
      for (let y = h * 0.3; y < h * 0.7; y += 2) {
        for (let x = w * 0.4; x < w * 0.6; x += 2) {
          const idx = (Math.floor(y) * w + Math.floor(x)) * 4;
          centerSum += (a[idx] + a[idx + 1] + a[idx + 2]) / 3;
          ccount++;
        }
      }
      const centerAvg = centerSum / Math.max(1, ccount);
      const postureScore = Math.max(0, Math.min(100, 50 + (centerAvg - 128) / 2));
      setPosture(Math.round(postureScore));
      setEngagement(Math.round((100 - head + gesture) / 2));
    }

    lastFrameRef.current = frame;
    rafRef.current = requestAnimationFrame(tick);
  };

  const setupAudio = async (stream: MediaStream) => {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const source = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 1024;
    source.connect(analyser);
    analyserRef.current = analyser;
    audioDataRef.current = new Uint8Array(analyser.frequencyBinCount);

    const compute = () => {
      if (!analyserRef.current || !audioDataRef.current) return;
      analyserRef.current.getByteTimeDomainData(audioDataRef.current);
      let sum = 0;
      for (let i = 0; i < audioDataRef.current.length; i++) {
        const v = (audioDataRef.current[i] - 128) / 128;
        sum += v * v;
      }
      const rms = Math.sqrt(sum / audioDataRef.current.length);
      setVolume(Math.min(100, Math.round(rms * 140)));
      if (running) requestAnimationFrame(compute);
    };
    compute();
  };

  const constraints = {
    video: true,
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
      channelCount: 1,
      sampleRate: 48000,
      sampleSize: 16,
    } as MediaTrackConstraints,
  } as MediaStreamConstraints;

  const testDevices = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      stream.getTracks().forEach((t) => t.stop());
      setDeviceOK(true);
    } catch {
      setDeviceOK(false);
      alert("Device test failed. Please allow camera & microphone.");
    }
  };

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      const videoTrack = stream.getVideoTracks()[0];
      const audioTrack = stream.getAudioTracks()[0];
      setCamActive(!!videoTrack && videoTrack.enabled);
      setMicActive(!!audioTrack && audioTrack.enabled);
      videoTrack?.addEventListener?.("ended", () => setCamActive(false));
      audioTrack?.addEventListener?.("ended", () => setMicActive(false));
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      await setupAudio(stream);
      setRunning(true);
      setStartedAt(Date.now());
      requestAnimationFrame(tick);
      if (speechSupported) startSpeech();
    } catch (e: any) {
      console.error(e);
      alert(e?.message || "Unable to access camera/mic. Please grant permissions.");
    }
  };

  const stop = async () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    stopSpeech();
    setRunning(false);
    const endedAt = Date.now();
    const durationSec = startedAt ? Math.round((endedAt - startedAt) / 1000) : 0;

    const clarity = Math.max(0, Math.min(100, 100 - fillerCount * 3));
    const confidence = Math.max(0, Math.min(100, 60 + Math.floor((100 - fillerCount) / 2)));

    const overall = Math.round(
      (clarity +
        confidence +
        posture +
        headStability +
        (100 - Math.abs(80 - paceWpm))) /
        5,
    );

    const filled = perQ.map((x) => x).filter(Boolean);
    if (!filled[qIndex]) {
      const score = Math.round((clarity + Math.min(100, paceWpm)) / 2);
      filled[qIndex] = {
        question: questions[qIndex],
        transcript,
        score,
        feedback: `Clarity ${clarity}%. Pace ${paceWpm} wpm.`,
      };
    }
    if (transcript.trim()) {
      allTranscriptRef.current = (allTranscriptRef.current + " " + transcript).trim();
    }
    const res: InterviewResult = {
      id: crypto.randomUUID(),
      startedAt: startedAt || endedAt,
      endedAt,
      durationSec,
      domain,
      type,
      questions: filled,
      transcript: allTranscriptRef.current.trim(),
      speech: {
        clarity,
        paceWpm,
        volume,
        fillerWords: fillerCount,
        confidence,
      },
      body: { posture, headStability, gestureActivity, engagement },
      overallScore: overall,
    };
    setResult(res);
    addSession(res);
  };

  return (
    <MainLayout>
      <section className="container py-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Setup</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3 text-sm">
                <div>
                  <label className="text-xs">Interview type</label>
                  <select
                    className="mt-1 w-full rounded border bg-background p-2"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option value="technical">Technical</option>
                    <option value="behavioral">Behavioral</option>
                    <option value="hr">HR</option>
                    <option value="case-study">Case Study</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs">Domain</label>
                  <select
                    className="mt-1 w-full rounded border bg-background p-2"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                  >
                    {Object.keys(questionBank).map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs">Questions</label>
                    <select
                      className="mt-1 w-full rounded border bg-background p-2"
                      value={count}
                      onChange={(e) => setCount(Number(e.target.value))}
                    >
                      {[3, 5, 8, 10].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs">Difficulty</label>
                    <select
                      className="mt-1 w-full rounded border bg-background p-2"
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                    >
                      {["Easy", "Medium", "Hard", "Expert", "Mixed"].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs">Mode</label>
                    <select
                      className="mt-1 w-full rounded border bg-background p-2"
                      value={mode}
                      onChange={(e) => setMode(e.target.value)}
                    >
                      <option value="practice">Practice</option>
                      <option value="exam">Exam</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs">Time per question (s)</label>
                    <input
                      type="number"
                      className="mt-1 w-full rounded border bg-background p-2"
                      value={timePerQ}
                      onChange={(e) => setTimePerQ(Number(e.target.value))}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={testDevices}>
                    Camera & Mic Test
                  </Button>
                  <span
                    className={`text-xs ${deviceOK ? "text-emerald-600" : "text-muted-foreground"}`}
                  >
                    {deviceOK ? "Devices OK" : "Not tested"}
                  </span>
                </div>
              </div>
              <div>
                <div className="aspect-video overflow-hidden rounded-lg border bg-black">
                  <video ref={videoRef} className="h-full w-full object-cover" muted playsInline />
                </div>
                <div className="mt-3 flex gap-3">
                  {!running ? (
                    <Button
                      onClick={start}
                      className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white"
                    >
                      Start Interview
                    </Button>
                  ) : (
                    <Button variant="destructive" onClick={stop}>
                      End Interview
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => nav("/dashboard")}>
                    Go to Dashboard
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mock Interview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <div className="mb-3 flex items-center gap-2 text-xs">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 border ${camActive ? "text-emerald-600 border-emerald-300 bg-emerald-50 dark:bg-emerald-900/20" : "text-muted-foreground"}`}
                    >
                      ● Camera {camActive ? "On" : "Off"}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 border ${micActive ? "text-emerald-600 border-emerald-300 bg-emerald-50 dark:bg-emerald-900/20" : "text-muted-foreground"}`}
                    >
                      ● Mic {micActive ? "On" : "Off"}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <Metric label="Posture" value={posture} />
                    <Metric label="Head Stability" value={headStability} />
                    <Metric label="Gestures" value={gestureActivity} />
                    <Metric label="Engagement" value={engagement} />
                    <Metric label="Volume" value={volume} />
                    <Metric label="WPM" value={paceWpm} />
                    <Metric label="Fillers" value={Math.min(100, fillerCount)} />
                  </div>
                </div>
                <div>
                  <h4 className="font-medium">Transcription</h4>
                  <div className="mt-3 h-40 overflow-auto rounded border p-2 text-xs whitespace-pre-wrap" aria-live="polite">
                    {transcript || "Transcript will appear here..."}
                  </div>
                  <div className="mt-3 flex gap-2 text-sm">
                    <Button size="sm" variant="outline" onClick={() => resetSpeech()}>
                      Reset transcript
                    </Button>
                  </div>
                </div>
              </div>
              <div className="mt-4 border-t pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-muted-foreground">
                      Question {qIndex + 1} of {questions.length}
                    </div>
                    <div className="font-medium">{questions[qIndex]}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={qIndex === 0}
                      onClick={() => {
                        setPerQ((arr) => {
                          const prev = [...arr];
                          if (!prev[qIndex])
                            prev[qIndex] = {
                              question: questions[qIndex],
                              transcript,
                              score: 0,
                              feedback: "",
                            };
                          return prev;
                        });
                        setQIndex(qIndex - 1);
                      }}
                    >
                      Prev
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        const clarity = Math.max(0, Math.min(100, 100 - fillerCount * 3));
                        const score = Math.round((clarity + Math.min(100, paceWpm)) / 2);
                        const feedback = `Clarity ${clarity}%. Pace ${paceWpm} wpm. Reduce filler words.`;
                        setPerQ((arr) => {
                          const prev = [...arr];
                          prev[qIndex] = {
                            question: questions[qIndex],
                            transcript,
                            score,
                            feedback,
                          };
                          return prev;
                        });
                        if (transcript.trim()) {
                          allTranscriptRef.current = (allTranscriptRef.current + " " + transcript).trim();
                        }
                        resetSpeech();
                        if (qIndex < questions.length - 1) setQIndex(qIndex + 1);
                      }}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
              <canvas ref={canvasRef} className="hidden" />
            </CardContent>
          </Card>

          {result && (
            <Card>
              <CardHeader>
                <CardTitle>Interview Result</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium">Summary</h4>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li>Duration: {result.durationSec}s</li>
                    <li>
                      Overall Score: <b>{result.overallScore}</b>
                    </li>
                    <li>
                      Clarity: {result.speech.clarity}% · Confidence: {result.speech.confidence}%
                    </li>
                    <li>
                      Posture: {result.body.posture}% · Stability: {result.body.headStability}%
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium">Recommendations</h4>
                  <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground">
                    <li>Avoid filler words to improve clarity.</li>
                    <li>Maintain steady head position for better presence.</li>
                    <li>Keep a balanced pace around 140–170 WPM.</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tips</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>Ensure good lighting and look towards the camera to simulate eye contact.</p>
              <p>Speak clearly and keep a steady pace. Avoid common fillers like “um” and “like”.</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </MainLayout>
  );
}
