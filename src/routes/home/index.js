import { h, Component } from 'preact';
import style from './style';
import { Icon, InlineIcon } from "@iconify/react";
import microphone from "@iconify/icons-mdi/microphone";
import accountTieVoiceOutline from '@iconify/icons-mdi/account-tie-voice-outline';



export default class Profile extends Component {
  state = {
    oqueouvi: '',
    btndisable: false,
    statusEscuta: '',
  };

  increment = () => {
    this.setState({ count: this.state.count + 1 });
  };

  
  speak = () => {
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
      utterThis.pitch = 1;
      utterThis.rate = 1;
      synth.speak(utterThis);
    }
  }

  testSpeech = () => {
    this.setState({ statusEscuta: 'Test in progress',disabled: true });
  
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
  
    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript.toLowerCase();
      
      this.setState({ oqueouvi: speechResult,disabled: false });
    }
  
    recognition.onspeechend = function() {
      recognition.stop();
      this.setState({ statusEscuta: 'Pode comecar novamente',disabled: false });
    }
  
    recognition.onerror = function(event) {
      this.setState({ statusEscuta: 'Deu ruim ! vamos tentar novamente ? '+ event.error,disabled: false });
    }
    
    
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
  render({ user }, { oqueouvi, btndisable, statusEscuta }) {
    return (
      <div class={style.profile}>
        <h1>O que ouvi: {user}</h1>
        <p>Em que pe estamos: {statusEscuta}.</p>
        <textarea  rows="4" cols="50">
          {oqueouvi}
          </textarea><button  ><InlineIcon onClick={this.testSpeech} disabled={btndisable} icon={microphone} /></button>
          <p>
          <Icon onClick={this.speak} disabled={btndisable} icon={accountTieVoiceOutline} />
          </p>
      </div>
    );
  }
}
