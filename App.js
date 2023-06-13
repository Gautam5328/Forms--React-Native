import React, {useMemo, useState} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  Platform,
  Button,
  Alert,
} from 'react-native';
const validator = require('validator');
import {TextInputMask} from 'react-native-masked-text';
import RadioGroup from 'react-native-radio-buttons-group';
import {Dropdown} from 'react-native-element-dropdown';
import {colorsData, radioButtonData, zipCodesData} from './src/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {decode as atob, encode as btoa} from 'base-64';

const App = () => {
  const [name, setName] = useState('');
  const [emailId, setEmailId] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [dob, setDob] = useState('');
  const [errText, setErrText] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [colorName, setColorName] = useState('');
  const [customColor, setColor] = useState('#000000');
  const radioButtons = useMemo(() => radioButtonData);
  const [enableShowData, setEnableShowData] = useState(false);
  const [selectedId, setSelectedId] = useState();
  const [showFormData, setShowFormData] = useState('');

  const handleZipCodeChange = e => {
    setZipCode(e);
    if (e == '') {
      setCity('');
      setState('');
    }
    zipCodesData.map(zipCodeInstant => {
      if (zipCodeInstant.zipcode == e) {
        setCity(zipCodeInstant.city);
        setState(zipCodeInstant.state);
      }
    });
  };

  const handleChangeName = e => {
    setName(e.toUpperCase());
  };

  const handleEmailChange = e => {
    setEmailId(e);
    if (validator.isEmail(e)) {
      setErrText('');
    } else {
      setErrText('Invalid Email ID');
    }
  };

  const handleMobileChange = e => {
    setMobileNumber(e);
    if (e.length == 10 && validator.isMobilePhone(e)) {
      setErrText('');
      var cleaned = ('' + e).replace(/\D/g, '');
      var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
      if (match) {
        var intlCode = match[1] ? '+1 ' : '',
          number = [
            intlCode,
            '(',
            match[2],
            ') ',
            match[3],
            '-',
            match[4],
          ].join('');

        setMobileNumber(number);

        return;
      }
      setMobileNumber(number);
    } else {
      setErrText('Invalid Phone Number');
    }
  };

  const handleSubmitForm = async () => {
    setEnableShowData(true);
    const formData = {
      name: name,
      emailId: emailId,
      mobileNumber: mobileNumber,
      DateofBirth: dob,
      gender: selectedId,
      ZipCode: zipCode,
      City: city,
      State: state,
      ColorName: colorName,
    };

    await AsyncStorage.setItem('FormData', JSON.stringify(formData));
    const encodedValue = btoa(JSON.stringify(formData));
    alert(encodedValue);
  };

  const checkFormValidation = () => {
    if (
      name == '' ||
      emailId == '' ||
      mobileNumber == '' ||
      dob == '' ||
      selectedId == '' ||
      zipCode == '' ||
      colorName == ''
    ) {
      return true;
    } else {
      return false;
    }
  };

  const handleColorChange = e => {
    setColorName(e.name);
    setColor(e.color);
  };

  const resetForm = () => {
    setName('');
    setEmailId('');
    setMobileNumber('');
    setDob('');
    setSelectedId('');
    setZipCode('');
    setCity('');
    setState('');
    setColor('');
    setColorName('');
  };

  const handleShowData = () => {
    const formData = {
      name: name,
      emailId: emailId,
      mobileNumber: mobileNumber,
      DateofBirth: dob,
      gender: selectedId,
      ZipCode: zipCode,
      City: city,
      State: state,
      ColorName: colorName,
    };
    setShowFormData(JSON.stringify(formData));
  };

  return (
    <View style={styles.container}>
      <Text
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
        }}>
        {' '}
        Sample Form{' '}
      </Text>
      {errText !== '' && (emailId !== '' || mobileNumber !== '') ? (
        <Text style={{color: 'red'}}>{errText}</Text>
      ) : null}
      <View>
        <TextInput
          placeholder="Name"
          value={name}
          style={{color: customColor}}
          onChangeText={handleChangeName}
        />
        <TextInput
          placeholder="Email Address"
          style={{color: customColor}}
          onChangeText={handleEmailChange}
          value={emailId}
        />
        <TextInput
          placeholder="Mobile Number"
          onChangeText={handleMobileChange}
          value={mobileNumber}
          style={{color: customColor}}
          dataDetectorTypes="phoneNumber"
          keyboardType="phone-pad"
        />

        <TextInputMask
          placeholder="Date of Birth"
          value={dob}
          onChangeText={e => setDob(e)}
          type={'datetime'}
          options={{
            format: 'DD-MM-YYYY HH:mm:ss',
          }}
        />

        <RadioGroup
          radioButtons={radioButtons}
          onPress={setSelectedId}
          selectedId={selectedId}
        />

        <TextInput
          placeholder="ZIP Code"
          style={{color: customColor}}
          onChangeText={handleZipCodeChange}
          value={zipCode}
        />

        <TextInput placeholder="City" value={city} style={{color: customColor}} />

        <TextInput placeholder="State" value={state} style={{color: customColor}} />

        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={colorsData}
          search
          maxHeight={300}
          labelField="name"
          valueField="color"
          placeholder="Select item"
          searchPlaceholder="Search..."
          value={colorName}
          onChange={handleColorChange}
        />

        <TextInput
          style={styles.input}
          value={showFormData}
          multiline={true}
          numberOfLines={4}
        />

        <View style={{marginTop: 120}}>
          <Button
            title="Submit"
            onPress={handleSubmitForm}
            disabled={checkFormValidation() == true}>
            Submit
          </Button>

          <Button
            title="Show Data"
            disabled={enableShowData == false}
            onPress={handleShowData}>
            Show Data
          </Button>

          <Button
            title="Reset Data"
            disabled={enableShowData == false}
            onPress={resetForm}>
            Reset Data
          </Button>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  //Check project repo for styles
  container: {
    margin: 20,
  },
});

export default App;
