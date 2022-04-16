import * as React from 'react';
import {View, TouchableOpacity} from 'react-native';
import RNCheckBox from '@react-native-community/checkbox';
import {useTheme} from '@react-navigation/native';
import styles from './styles';
import Container from '../Container';
import Text from '../Text';
import {Button, Icon} from '@src/components/elements';

type CheckBoxProps = {
  label: string;
  onPress: (checked: boolean, qty: number) => void;
  value: boolean;
  boxType: any;
  rightElement?: React.ReactElement;
};
// [x] + - in sub items

const CheckBox: React.FC<CheckBoxProps> = ({label, onPress, rightElement, value, boxType, ...restProps}) => {
  const {
    colors: {primary, text},
  } = useTheme();
  const [checked, setChecked] = React.useState<boolean>(false);
  const [Qty, setQty] = React.useState<number>(1);
  const _onPress = () => {
    // setChecked(!checked);
    onPress(false, Qty);
  };
  const setQtyPlus = q => {
    if (q > 0) {
      setQty(Qty + 1);
      onPress(true, Qty + 1);
    } else {
      if (Qty > 1) {
        setQty(Qty - 1);
        onPress(true, Qty - 1);
      }
    }
  };
  return (
    <TouchableOpacity style={styles.button} onPress={_onPress}>
      <Container style={styles.checkBoxContainer}>
        <View style={{flex: .1}}>
          <RNCheckBox
            style={styles.checkBox}
            value={value}
            onCheckColor="transparent"
            onTintColor={primary}
            onFillColor={primary}
            boxType={boxType ? boxType : 'square'}
            onValueChange={_onPress}
            {...restProps}
            disabled={true}
            tintColors={{
              true: primary,
              false: text,
            }}
            onAnimationType="bounce"
            offAnimationType="bounce"
          />
        </View>

        <View style={{flex: .4}}>
          <Text>{label}</Text>
        </View>
        {boxType ? null : (
          <Container style={styles.buttonGroupContainer}>
            <Button
              style={styles.buttonPlus}
              onPress={() => {
                setQtyPlus(-1);
              }}>
              <Icon name="minus" isPrimary />
            </Button>
            <Text style={styles.amount}>{Qty}</Text>
            <Button
              style={styles.buttonPlus}
              onPress={() => {
                setQtyPlus(+1);
              }}>
              <Icon name="plus" isPrimary />
            </Button>
          </Container>
        )}
      </Container>
      {rightElement && <Container style={styles.rightElementContainer}>{rightElement}</Container>}
    </TouchableOpacity>
  );
};

export default CheckBox;
