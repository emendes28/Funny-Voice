import { h, Component } from 'preact';
import style from './style';
import { Icon, InlineIcon } from "@iconify/react";
import microphone from "@iconify/icons-mdi/microphone";
import accountTieVoiceOutline from '@iconify/icons-mdi/account-tie-voice-outline';
import Sidebar from "../../components/sidebar"

import { Layout, Navigation, Card, Button, Icon, TextField } from "preact-mdl"


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
      utterThis.pitch = 1.2;
      utterThis.rate = 0.6;
      synth.speak(utterThis);
      synth.
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
      
      <Layout fixed-header fixed-drawer>
      <Sidebar />
      <Card shadow="4" class="full-width">
        <Card.Title class="graphic">
          <Card.TitleText>Fala eu que te escuto</Card.TitleText>
        </Card.Title>
        <Card.Text style="text-align:center">
          
        <textarea  rows="4" cols="50">
          {oqueouvi}
          </textarea>
        </Card.Text>
        <Card.Actions style="text-align:right">
          <Icon onClick={this.testSpeech} disabled={btndisable} icon={microphone} />
        </Card.Actions>
        <Card.Actions style="text-align:left">
          <Icon onClick={this.speak} disabled={btndisable} icon={accountTieVoiceOutline} />
        </Card.Actions>
      </Card>
          <Layout.Content>
            <Router>
              <Home path="/" default />
              <Profile path="/profile" id="me" />
              <Profile path="/profile/:id" />
            </Router>
          </Layout.Content>
        </Layout>
    );
  }
}
