import React, {Component} from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
} from 'react-native'
import firebase from 'react-native-firebase'

import {Button} from 'react-native-elements'

class Login extends Component {
  state = {
    user: null,
    message: '',
    codeInput: '',
    phoneNumber: '+91',
    confirmResult: null,
  }

  signIn = () => {
    const {phoneNumber} = this.state
    this.setState({message: 'Sending OTP ...'})

    firebase
      .auth()
      .signInWithPhoneNumber(phoneNumber)
      .then(confirmResult =>
        this.setState({confirmResult, message: 'OTP has been sent!'}),
      )
      .catch(
        this.setState({
          message: ``,
        }),
      )
  }

  confirmCode = () => {
    const {codeInput, confirmResult} = this.state
    if (confirmResult && codeInput.length) {
      confirmResult
        .confirm(codeInput)
        .then(_ => {
          this.setState({message: 'OTP Confirmed!'})
        })
        .catch(this.setState({message: ``}))
    }
  }

  renderPhoneNumberInput() {
    const {phoneNumber} = this.state

    return (
      <View style={styles.loginContainer}>
        <Text style={styles.directionsFont}>Enter phone number:</Text>
        <TextInput
          autoFocus
          style={styles.formContainer}
          keyboardType="numeric"
          textAlign="center"
          onChangeText={value => this.setState({phoneNumber: value})}
          placeholder="Phone number ... "
          value={phoneNumber}
          color="black"
        />
        <Button
          title="Sign In"
          buttonStyle={{borderRadius: 25, backgroundColor: '#20AAB2'}}
          textStyle={{fontSize: 20, fontWeight: 'bold'}}
          onPress={this.signIn}
          icon={{name: 'sign-in', type: 'font-awesome', size: 20}}
        />
      </View>
    )
  }

  renderMessage() {
    const {message} = this.state

    return message.length ? (
      <Text style={styles.whiteFont}>{message}</Text>
    ) : null
  }

  renderVerificationCodeInput() {
    const {codeInput} = this.state

    return (
      <View style={styles.loginContainer}>
        <Text style={styles.directionsFont}>
          Enter verification code below:
        </Text>
        <TextInput
          autoFocus
          style={styles.formContainer}
          keyboardType="numeric"
          textAlign="center"
          onChangeText={value => this.setState({codeInput: value})}
          placeholder="Code ... "
          value={codeInput}
          keyboardType="numeric"
        />
        <Button
          title="Confirm Code"
          buttonStyle={{borderRadius: 25, backgroundColor: '#20AAB2'}}
          textStyle={{fontSize: 20, fontWeight: 'bold'}}
          icon={{name: 'hand-o-right', type: 'font-awesome', size: 20}}
          onPress={this.confirmCode}
          disabled={!this.state.codeInput.length === 6}
        />
      </View>
    )
  }

  render() {
    const {user, confirmResult} = this.state
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <Image
          style={{flex: 1, width: '77%', padding: 22, marginTop: 125}}
          source={require('../../Public/fullLogo20AAB2.png')}
          resizeMode="contain"
        />
        {!user && !confirmResult && this.renderPhoneNumberInput()}

        {this.renderMessage()}

        {!user && confirmResult && this.renderVerificationCodeInput()}
      </KeyboardAvoidingView>
    )
  }
}

export default Login

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    backgroundColor: '#fff',
    width: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    marginTop: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 20,
    borderRadius: 25,
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
    width: 200,
    padding: 10,
  },
  loginContainer: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
    padding: 25,
  },
  whiteFont: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 21,
  },
  directionsFont: {
    color: 'grey',
    fontSize: 20,
  },
})
