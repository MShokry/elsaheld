import * as React from 'react';
import { SafeAreaView, View, ScrollView, Alert } from 'react-native';
import { Text, TextField, Button } from '@src/components/elements';
import useThemeColors from '@src/custom-hooks/useThemeColors';
import styles from './styles';
import EmailSentModal from './EmailSentModal';

type ForgotPasswordProps = {};

const ForgotPassword: React.FC<ForgotPasswordProps> = () => {
  const { card } = useThemeColors();
  const [email, setEmail] = React.useState('');
  const [sentEmailModalVisible, setSentEmailModalVisible] = React.useState(
    false,
  );

  const _onPasswordFieldChange = (value: string) => {
    setEmail(value);
  };

  const _onConfirmButtonPressed = () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email!');
      return;
    }
    setSentEmailModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.formContainer}>
          <Text isBold isHeadingTitle>
            نسيت كلمة المرور؟
          </Text>
          <Text isSecondary hasMargin>
            سيتم ارسال كلمة المرور الجديده الي هاتفك
          </Text>
          <TextField
            autoFocus
            style={[{ backgroundColor: card }, styles.emailTextField]}
            value={email}
            onChangeText={_onPasswordFieldChange}
            hasMargin
            placeholder="ادخل رقم الهاتف"
            keyboardType='number-pad'
          />
        </View>
        <Button isFullWidth onPress={_onConfirmButtonPressed}>
          <Text isBold>Confirm</Text>
        </Button>
      </ScrollView>
      <EmailSentModal
        isVisible={sentEmailModalVisible}
        setIsVisble={setSentEmailModalVisible}
      />
    </SafeAreaView>
  );
};

export default ForgotPassword;
