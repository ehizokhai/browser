import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Keyboard,
  Image,
  TouchableHighlight,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import {WebView} from 'react-native-webview';
import Loader from '../../components/Loader';
import Assets from '../../assets';
import styles from './styles';
// keeps the reference to the browser
let browserRef = null;

// initial url for the browser
const url = 'http://www.google.com';

// javascript to inject into the window
const injectedJavaScript = `
      window.ReactNativeWebView.postMessage('injected javascript works!');
      true; // note: this is required, or you'll sometimes get silent failures   
`;

// functions to search using different engines
const mySearchEngines = {
  google: (path) => `https://www.google.com/search?q=${path}`,
};

function formatUrl(uri, searchEngine = 'google') {
  const isURL = uri.split(' ').length === 1 && uri.includes('.');
  if (isURL) {
    if (!uri.startsWith('http')) {
      return 'https://www.' + uri;
    }
    return uri;
  }
  // search for the text in the search engine
  const encodedURI = encodeURI(uri);
  return mySearchEngines[searchEngine](encodedURI);
}
class ReminatoBrowser extends Component {
  state = {
    currentURL: url,
    urlText: url,
    title: '',
    canGoForward: false,
    canGoBack: false,
    incognito: false,
    showLoader: false,
    progressPercent: 0,
    // change configurations so the user can
    // better control the browser
    config: {
      detectorTypes: 'all',
      allowStorage: true,
      allowJavascript: true,
      allowCookies: true,
      allowLocation: true,
      allowCaching: true,
      defaultSearchEngine: 'google',
    },
  };

  // get the configuration, this allows us to change
  get config() {
    const {incognito, config} = this.state;
    if (incognito) {
      return {
        ...config,
        allowStorage: false,
        allowCookies: false,
        allowLocation: false,
        allowCaching: false,
      };
    }
    return config;
  }

  // toggle incognito mode
  toggleIncognito = () => {
    this.setState({
      incognito: !this.state.incognito,
    });
    this.reload();
  };

  // load the url from the text input
  loadURL = () => {
    const {config, urlText} = this.state;
    const {defaultSearchEngine} = config;
    const newURL = formatUrl(urlText, defaultSearchEngine);

    this.setState({
      currentURL: newURL,
      urlText: newURL,
    });
    Keyboard.dismiss();
  };

  // update the text input
  updateUrlText = (text) => {
    this.setState({
      urlText: text,
    });
  };

  // go to the next page
  goForward = () => {
    if (browserRef && this.state.canGoForward) {
      browserRef.goForward();
    }
  };

  // reload the page
  reload = () => {
    if (browserRef) {
      browserRef.reload();
    }
  };

  goBackward = () => {
    if (browserRef && this.state.canGoBack) {
      browserRef.goBack();
    }
  };

  setBrowserRef = (browser) => {
    if (!browserRef) {
      browserRef = browser;
    }
  };

  // this is triggered when an error occured
  onLoadError = (syntheticEvent) => {
    const {nativeEvent} = syntheticEvent;
    console.warn('WebView error: ', nativeEvent);
  };

  // this is triggered wgeb the webview is loaded
  onLoad = (syntheticEvent) => {
    const {canGoForward, canGoBack, title} = syntheticEvent.nativeEvent;
    this.setState({
      canGoForward,
      canGoBack,
      title,
    });
  };
  // when navigation changes
  onNavigationStateChange = (navState) => {
    const {canGoForward, canGoBack, title} = navState;
    this.setState({
      canGoForward,
      canGoBack,
      title,
    });
  };

  // to fix onLoadEnd that doesnt get called all the time when oage finishes loading
  updateProgress = (progres) => {
    this.setState({progressPercent: progres});
  };

  render() {
    const {config, state} = this;
    const {currentURL, urlText, canGoForward, canGoBack, incognito} = state;
    return (
      <View style={styles.root}>
        <SafeAreaView style={styles.safeAreaBgColor} />

        <View style={styles.browserBar}>
          <TouchableHighlight onPress={this.loadURL}>
            <Image style={[styles.icon, styles.mgLeft]} source={Assets.web} />
          </TouchableHighlight>
          <TextInput
            autoCapitalize={false}
            style={styles.browserAddressBar}
            onChangeText={this.updateUrlText}
            value={urlText}
            onSubmitEditing={this.loadURL}
          />
        </View>
        {this.state.showLoader && (
          <Loader myProgress={this.state.progressPercent} />
        )}
        <View style={styles.browserContainer}>
          <WebView
            ref={this.setBrowserRef}
            originWhitelist={['*']}
            source={{uri: currentURL}}
            onLoad={this.onLoad}
            onLoadStart={() => this.setState({showLoader: true})}
            onLoadEnd={() => this.setState({showLoader: false})}
            onError={this.onLoadError}
            onNavigationStateChange={this.onNavigationStateChange}
            dataDetectorTypes={config.detectorTypes}
            thirdPartyCookiesEnabled={config.allowCookies}
            domStorageEnabled={config.allowStorage}
            javaScriptEnabled={config.allowJavascript}
            geolocationEnabled={config.allowLocation}
            pullToRefreshEnabled={true}
            cacheEnabled={config.allowCaching}
            injectedJavaScript={injectedJavaScript}
            onLoadProgress={({nativeEvent}) => {
              this.loadingProgress = nativeEvent.progress;
              let progres = nativeEvent.progress * 100;
              this.updateProgress(progres);
            }}
          />
          <View style={styles.bottomTab}>
            <TouchableHighlight onPress={this.goBackward}>
              <Image
                style={[styles.icon, canGoBack ? {} : styles.disabled]}
                source={Assets.backArrow}
              />
            </TouchableHighlight>

            <TouchableHighlight onPress={this.goForward}>
              <Image
                style={[styles.icon, canGoForward ? {} : styles.disabled]}
                source={Assets.nextArrow}
              />
            </TouchableHighlight>

            <TouchableHighlight onPress={this.reload}>
              <Image style={styles.icon} source={Assets.pageRefresh} />
            </TouchableHighlight>

            <TouchableHighlight onPress={this.toggleIncognito}>
              <Image
                style={[styles.icon, incognito ? {} : styles.disabled]}
                source={Assets.incognito}
              />
            </TouchableHighlight>
          </View>
        </View>
      </View>
    );
  }
}

export default ReminatoBrowser;
