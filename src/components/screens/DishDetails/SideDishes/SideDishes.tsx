import * as React from 'react';
import { View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Container, Text, CheckBox, RadioButton } from '@src/components/elements';
import { Dish } from '@src/data/mock-places';
import styles from './styles';

type SideDishesProps = {
  data: Dish;
  addSideDishToBasket: (dish: Dish) => void;
};

const SideDishes: React.FC<SideDishesProps> = ({
  data: { MenuListOptions },
  addSideDishToBasket,
}) => {
  const {
    colors: { border },
  } = useTheme();
  const onCheckBoxPress = (selectedDish: Dish) => {
    return () => {
      addSideDishToBasket(selectedDish);
    };
  };
  console.log(MenuListOptions);

  // const sideDetailsData = SideData||[];
  // // sideDetailsData.data = sideDetailsData.Menu;
  // sideDetailsData.data = sideDetailsData.MenuListOptions?.map((item) => {
  //   return { ...item,  data: item.MenuListOptions }
  // });
  return (
    <View>
      {MenuListOptions?.map((section, sectionIndex) => (
        <View key={sectionIndex}>
          <Text style={styles.sectionTitle}>{section.name}</Text>
          {section?.OptionsList?.map((dish, dishIndex) => (
            <Container
              key={dishIndex}
              style={[styles.dishItemContainer, { borderBottomColor: border }]}>
              <Container style={styles.checkBoxContainer}>

                <CheckBox
                  label={dish.name}
                  onPress={onCheckBoxPress(dish)}
                  rightElement={<Text>+ ${dish.price}</Text>}
                />

              </Container>

            </Container>
          ))}
        </View>
      ))}
    </View>
  );
};

export default SideDishes;
