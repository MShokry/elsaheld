import * as React from 'react';
import { View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Container, Text, CheckBox, RadioButton } from '@src/components/elements';
import { Dish } from '@src/data/mock-places';
import RadioGroup from 'react-native-radio-buttons-group';
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
  const [selectedSideDishes, setSelectedSideDishes] = React.useState<Dish[]>(
    [],
  );

  const onCheckBoxPress = (selectedDish: Dish, group) => {
    let selected = selectedSideDishes;
    if (group.length) {
      console.log("groups", group);
      group.map((dish) => {
        const existedDishIndex = selected.find(
          (item: Dish) => item.ID === dish.ID,
        );
        if (existedDishIndex) {
          selected = selected.filter((item: Dish) => item.ID !== dish.ID)
        }
      })
      selected = [...selected, selectedDish];
    } else {
      const existedDishIndex = selectedSideDishes.find(
        (item: Dish) => item.ID === selectedDish.ID,
      );
      if (existedDishIndex) {
        selected = selected.filter((item: Dish) => item.ID !== selectedDish.ID)
      } else {
        selected = [...selectedSideDishes, selectedDish];
      }
    }
    console.log("selected", selected);
    setSelectedSideDishes(selected);
    addSideDishToBasket(selected);
  };
  console.log("selectedSideDishes", selectedSideDishes);

  return (
    <View>
      {MenuListOptions?.map((section, sectionIndex) => (
        <View key={sectionIndex}>
          <Text style={styles.sectionTitle}>{section.name}</Text>
          {/* {section?.type == 1 ? _renderRaido(section?.OptionsList) : null} */}
          {section?.OptionsList?.map((dish, dishIndex) => (
            <Container
              key={dishIndex}
              style={[styles.dishItemContainer, { borderBottomColor: border }]}>
              <Container style={styles.checkBoxContainer}>
                <CheckBox
                  label={dish.name}
                  value={!!selectedSideDishes.find((item) => item.ID === dish.ID)}
                  boxType={section?.type == 1 ? 'circle' : null}
                  // onPress={()=>{}}
                  onPress={() => onCheckBoxPress(dish, section?.type == 1 ? section?.OptionsList : [])}
                  rightElement={<Text>{section?.type == 1?'':'+'} EGP{dish.price}</Text>}
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
