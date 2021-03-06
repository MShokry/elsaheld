import * as React from 'react';
import {
  Container,
  Text,
  TextField,
  Button,
  Icon,
} from '@src/components/elements';
import styles from './styles';
import { translate as T } from '@src/utils/LangHelper';

type AddToBasketFormProps = {
  updateTotalDishAmount: (amount: number) => void;
};

const AddToBasketForm: React.FC<AddToBasketFormProps> = ({
  updateTotalDishAmount,
  message,
  setMessage,
  totalAmount,
  setTotalAmount
}) => {
  // const [totalAmount, setTotalAmount] = React.useState(1);

  const onButtonPressed = (amount: number) => {
    return () => {
      if (totalAmount === 1 && amount < 1) {
        return;
      }
      const newTotalAmount = totalAmount + amount;
      setTotalAmount(newTotalAmount);
      updateTotalDishAmount(newTotalAmount);
    };
  };

  return (
    <Container style={styles.formContainer}>
      <Text style={styles.title}>{T('Cart.Instruction')}</Text>
      <TextField
        containerStyle={styles.textField}
        value={message}
        onChangeText={(t: string) => setMessage(t)}
        placeholder={T('Cart.note')}
      />
      <Container style={styles.buttonGroupSection}>
        <Container style={styles.buttonGroupContainer}>
          <Button style={styles.button} onPress={onButtonPressed(-1)}>
            <Icon name="minus" isPrimary />
          </Button>
          <Text style={styles.amount}>{totalAmount}</Text>
          <Button style={styles.button} onPress={onButtonPressed(1)}>
            <Icon name="plus" isPrimary />
          </Button>
        </Container>
      </Container>
    </Container>
  );
};
export default AddToBasketForm;
