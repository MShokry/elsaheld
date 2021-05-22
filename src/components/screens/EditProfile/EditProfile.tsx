import * as React from 'react';
import {ScrollView} from 'react-native';
import {profile} from '@src/data/mock-profile';
import HeadingInformation from './HeadingInformation';
import ContactInformationForm from './ContactInformationForm';
import LinkedAccounts from './LinkedAccounts';
import AuthContext from '@src/context/auth-context';
  

type EditProfileProps = {};

const EditProfile: React.FC<EditProfileProps> = () => {
  const [contextState, contextDispatch] = React.useContext(AuthContext);
  const user = contextState.user?.user;
  console.log(contextState);
  return (
    <ScrollView>
      <HeadingInformation profile={profile} />
      <ContactInformationForm profile={user} />
      {/* <LinkedAccounts /> */}
    </ScrollView>
  );
};

export default EditProfile;
