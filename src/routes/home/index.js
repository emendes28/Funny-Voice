import { h } from 'preact';
import style from './style';



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
      if (synth.speaking) {
          console.error('speechSynthesis.speaking');
          return;
      }
      if (this.state.oqueouvi !== '') {
      const utterThis = new SpeechSynthesisUtterance(this.state.oqueouvi);
      const selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
      for(i = 0; i < voices.length ; i++) {
        if(voices[i].name === selectedOption) {
          utterThis.voice = voices[i];
          break;
        }
      }
      utterThis.pitch = pitch.value;
      utterThis.rate = rate.value;
      synth.speak(utterThis);
    }
  }

  testSpeech = () => {
    this.setState({ statusEscuta: 'Test in progress',disabled: true });
  
    const SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
    const SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
    const SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;
    const grammar = '#JSGF V1.0; grammar phrase; public <phrase> = ' + phrase +';';
    const recognition = new SpeechRecognition();
    const speechRecognitionList = new SpeechGrammarList();
    speechRecognitionList.addFromString(grammar, 1);
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
        <input type="textarea" value={oqueouvi}  rows="4" cols="50"/>
        <p>
          <button onClick={this.testSpeech} disabled={btndisable}>Ouvir</button> 
        </p>

      </div>
    );
  }
}
