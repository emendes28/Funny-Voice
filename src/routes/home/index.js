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
      utterThis.pitch = this.state.tom;
      utterThis.rate = this.state.velocidade;
      synth.speak(utterThis);
      const mediaRecorder = new MediaRecorder(stream);

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
    const thisContext = this;
    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript.toLowerCase();
      
      thisContext.setState({ oqueouvi: speechResult,disabled: false });
    }
  
    recognition.onspeechend = () => {
      recognition.stop();
      thisContext.setState({ statusEscuta: 'Pode comecar novamente',disabled: false });
    }
  
    recognition.onerror = (event) => {
      thisContext.setState({ statusEscuta: 'Deu ruim ! vamos tentar novamente ? '+ event.error,disabled: false });
    }
    
    
  }

  setText = (e) =>{
    this.setState({ oqueouvi: e.target.value,disabled: true });
  }
  
  setVelocidade = (e) =>{
    this.setState({ velocidade: e.target.value,disabled: true });
  }
  
  setTom = (e) =>{
    this.setState({ tom: e.target.value,disabled: true });
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
  render({ user }, { oqueouvi, btndisable, velocidade, tom }) {
    return (
      
      <Card shadow="4" class="full-width">
        <Card.Title class="graphic">
          <Card.TitleText>Fala eu que te escuto</Card.TitleText>
        </Card.Title>
        <Card.Text style="text-align:center">
            <fieldset> <figcaption>Mensagem</figcaption>
            <textarea onChange={this.setText} value={oqueouvi}></textarea>
            </fieldset>
        </Card.Text>
        <Card.Actions style="text-align:center">
          <Icon  width="15%" onClick={this.testSpeech} disabled={btndisable} icon={microphone} />        
        </Card.Actions>
        <Card.Text style="text-align:center">
          
        <fieldset> <figcaption>Ajuste da voz</figcaption>
      <label for="veloz">Velocidade</label>
            <Slider min="0.5" onChange={this.setVelocidade}  max="2" value={velocidade} step="0.1" id="veloz"/>
      <label for="tonalidade">Tonalidade</label>
            <Slider min="0" max="2" onChange={this.setTom}  value={tom} step="0.1" id="tonalidade"/>
            </fieldset>
        </Card.Text>
        <Card.Actions style="text-align:center">
          <Icon width="15%" onClick={this.speak} disabled={btndisable} icon={download} />
          <Icon width="15%" onClick={this.speak} disabled={btndisable} icon={accountTieVoiceOutline} />
        
        </Card.Actions>
      </Card>
    );
  }
}
