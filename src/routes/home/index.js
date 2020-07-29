import { h, Component } from 'preact';
import style from './style';
import { Icon, InlineIcon } from "@iconify/react";
import microphone from "@iconify/icons-mdi/microphone";
import accountTieVoiceOutline from '@iconify/icons-mdi/account-tie-voice-outline';
import download from '@iconify/icons-mdi/download';
import Sidebar from "../../components/sidebar"

import { Layout, Card, Slider } from "preact-mdl"


export default class Profile extends Component {
  state = {
    oqueouvi: '',
    btndisable: false,
    statusEscuta: '',
    velocidade: 1,
    tom: 1,
    linkDownload: '',
    preview: Object,
  };

  increment = () => {
    this.setState({ count: this.state.count + 1 });
  };


  speak = () => {

  //  console.log('ini',AudioTrack.sourceBuffer);

    const synth = window.speechSynthesis;
    if (synth.speaking) {
      console.error('speechSynthesis.speaking');
      return;
    }
    if (this.state.oqueouvi !== '') {
      const utterThis = new SpeechSynthesisUtterance(this.state.oqueouvi);
      const voice = window.speechSynthesis.getVoices();
      const thevoice = voice.filter(voice => voice.lang === 'pt-BR');
      utterThis.voice = thevoice[0];
      utterThis.pitch = this.state.tom;
      utterThis.rate = this.state.velocidade;
      this.alien1Transform(utterThis);
      utterThis.onboundary  = (event) => console.log(event);
      synth.speak(utterThis);
    }
  }
  log = (info) => {
    console.log(info);
  }
  startRecording = (stream, lengthInMS) => {
    let recorder = new MediaRecorder(stream);
    let data = [];

    recorder.ondataavailable = event => data.push(event.data);
    recorder.start();

    let stopped = new Promise((resolve, reject) => {
      recorder.onstop = resolve;
      recorder.onerror = event => reject(event.name);
    });

    let recorded = wait(lengthInMS).then(
      () => recorder.state == "recording" && recorder.stop()
    );

    return Promise.all([
      stopped,
      recorded
    ]).then(() => data);
  }
  stop = (stream) => {
    stream.getTracks().forEach(track => track.stop());
  }
  wait = (delayInMS) => {
    return new Promise(resolve => setTimeout(resolve, delayInMS));
  }
  rec = () => {
    const preview = document.getElementById("preview");
    navigator.mediaDevices.getUserMedia({
      audio: true
    }).then(stream => {
      preview.srcObject = stream;
      
    this.stop(stream);
      return new Promise(resolve => preview.onplaying = resolve);
    }).then(() => this.startRecording(preview.captureStream(), 5000))
      .then(recordedChunks => {

        let recordedBlob = new Blob(recordedChunks, { type: "audio/mp3" });
        this.setState({ linkDownload: URL.createObjectURL(recordedBlob) });

      })
      .catch(this.log);
  }

  alien1Transform(audioBuffer) {

    let ctx = new OfflineAudioContext(audioBuffer.numberOfChannels, audioBuffer.length, audioBuffer.sampleRate);
  
    let source = ctx.createBufferSource();
    source.buffer = audioBuffer;
  
    let oscillator = ctx.createOscillator();
    oscillator.frequency.value = 5;
    oscillator.type = 'sine';
  
    let oscillatorGain = ctx.createGain();
    oscillatorGain.gain.value = 0.05;
  
    let delay = ctx.createDelay();
    delay.delayTime.value = 0.05;
    
    source.connect(delay);
    delay.connect(ctx.destination);
  
    oscillator.connect(oscillatorGain);
    oscillatorGain.connect(delay.delayTime);
  
    oscillator.start();
    source.start();
    return ctx.startRendering().then(
      (outputAudioBuffer) => outputAudioBuffer
    )
  
  }

  testSpeech = () => {
    this.setState({ statusEscuta: 'Test in progress', disabled: true });

    const SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
    const SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
    const SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;
    const recognition = new SpeechRecognition();
    const speechRecognitionList = new SpeechGrammarList();
    recognition.grammars = speechRecognitionList;
    recognition.lang = 'pt-BR';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();
    const thisContext = this;
    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript.toLowerCase();

      thisContext.setState({ oqueouvi: speechResult, disabled: false });
    }

    recognition.onspeechend = () => {
      recognition.stop();
      thisContext.setState({ statusEscuta: 'Pode comecar novamente', disabled: false });
    }

    recognition.onerror = (event) => {
      thisContext.setState({ statusEscuta: 'Deu ruim ! vamos tentar novamente ? ' + event.error, disabled: false });
    }


  }

  setText = (e) => {
    this.setState({ oqueouvi: e.target.value, disabled: true });
  }

  setVelocidade = (e) => {
    this.setState({ velocidade: e.target.value, disabled: true });
  }

  setTom = (e) => {
    this.setState({ tom: e.target.value, disabled: true });
  }
  // gets called when this route is navigated to
  componentDidMount() {
    // start a timer for the clock:
    //this.statusEscuta = setInterval(this.updateTime, 1000);
  }

  // gets called just before navigating away from the route
  componentWillUnmount() {
    //clearInterval(this.timer);
  }

  // Note: `user` comes from the URL, courtesy of our router
  render({ user }, { oqueouvi, btndisable, velocidade, tom, linkDownload }) {
    return (

      <Card shadow="4" class="full-width">
        <Card.Title class="graphic">
          <Card.TitleText>Fale ou escreva eu que te repito</Card.TitleText>
        </Card.Title>
        <Card.Text style="text-align:center">
          <fieldset> <figcaption>Mensagem</figcaption>
            <textarea onChange={this.setText} value={oqueouvi}></textarea>
          </fieldset>
        </Card.Text>
        <Card.Actions style="text-align:center">
          <Icon width="15%" onClick={this.testSpeech} disabled={btndisable} icon={microphone} />
    
          <Icon width="15%" onClick={this.speak} disabled={btndisable} icon={accountTieVoiceOutline} />

        </Card.Actions>

      </Card>
    );
  }
}
