import * as React from 'react';
import {Container, TextField, Text, Button} from '@src/components/elements';
import {Profile} from '@src/data/mock-profile';
import styles from './styles';

type ContactInformationFormProps = {
  profile: Profile;
};

const ContactInformationForm: React.FC<ContactInformationFormProps> = ({profile}) => {
  const [password, setPassword] = React.useState('');
  const [confirmPass, setconfirmPass] = React.useState('');
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [name, setname] = React.useState('');
  const [email, setemail] = React.useState('');
  return (
    <Container style={styles.container}>
      <TextField
        defaultValue={profile.name}
        textContentType="name"
        hasMargin
        onChangeText={(t: string) => setname(t)}
      />
      <TextField
        defaultValue={profile.phone}
        textContentType="telephoneNumber"
        hasMargin
        onChangeText={(t: string) => setPhoneNumber(t)}
      />
      <TextField
        defaultValue={profile.email}
        textContentType="emailAddress"
        hasMargin
        onChangeText={(t: string) => setPhoneNumber(t)}
      />
      {/* <Text isSecondary style={styles.note}>
        Communications and transaction history will be sent to this email
        address
      </Text> */}
      <Button>
        <Text isWhite isBold>
          حفظ
        </Text>
      </Button>
    </Container>
  );
};
export default ContactInformationForm;
