import { useTheme } from '@react-navigation/native';
import { CheckBox, Container, Text } from '@src/components/elements';
import { Dish } from '@src/data/mock-places';
import * as React from 'react';
import { View } from 'react-native';
import styles from './styles';

type SideDishesProps = {
  data: Dish;
  addSideDishToBasket: (dish: Dish) => void;
};
// [x] + - in sub items
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

  const onCheckBoxPress = (checked: bool, selectedDish: Dish, group) => {
    if (checked) {
      let selected = selectedSideDishes;
      if (group.length) {
        console.log('groups', group);
        group.map(dish => {
          const existedDishIndex = selected.find(
            (item: Dish) => item.ID === dish.ID,
          );
          if (existedDishIndex) {
            selected = selected.filter((item: Dish) => item.ID !== dish.ID);
          }
        });
        selected = [...selected, selectedDish];
      } else {
        const existedDishIndex = selectedSideDishes.find(
          (item: Dish) => item.ID === selectedDish.ID,
        );
        if (existedDishIndex) {
          selected = selected.filter((item: Dish) => item.ID !== selectedDish.ID);
          selected = [...selected, selectedDish];
        } else {
          selected = [...selectedSideDishes, selectedDish];
        }
      }
      console.log('selected', selected);
      setSelectedSideDishes(selected);
      addSideDishToBasket(selected);
    } else {
      let selected = selectedSideDishes;
      if (group.length) {
        console.log('groups', group);
        group.map(dish => {
          const existedDishIndex = selected.find(
            (item: Dish) => item.ID === dish.ID,
          );
          if (existedDishIndex) {
            selected = selected.filter((item: Dish) => item.ID !== dish.ID);
          }
        });
        selected = [...selected, selectedDish];
      } else {
        const existedDishIndex = selectedSideDishes.find(
          (item: Dish) => item.ID === selectedDish.ID,
        );
        if (existedDishIndex) {
          selected = selected.filter((item: Dish) => item.ID !== selectedDish.ID);
        } else {
          selected = [...selectedSideDishes, selectedDish];
        }
      }
      console.log('selected', selected);
      setSelectedSideDishes(selected);
      addSideDishToBasket(selected);
    }
  };

  console.log('selectedSideDishes', MenuListOptions, selectedSideDishes);
  React.useEffect(() => {
    MenuListOptions?.map((section, sectionIndex) => {
      section?.OptionsList?.map((dish, dishIndex) => {
        if (dish.default_choice) {
          onCheckBoxPress(true, { ...dish, 'Amount': 1 }, section?.type == 1 ? section?.OptionsList : []);
        }
      });
    });
  }, [MenuListOptions]);

  // React.useEffect(() => {
  //   onCheckBoxPress(checked, { ...dish, 'Amount': qty }, section?.type == 1 ? section?.OptionsList : [])
  // }, []);
  // [ ] ToDo default_choice
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
                  onPress={(checked, qty) => onCheckBoxPress(checked, { ...dish, 'Amount': qty }, section?.type == 1 ? section?.OptionsList : [])}
                  rightElement={
                    <Text>
                      {section?.type === 1 ? '' : '+'} EGP {dish.price}
                    </Text>
                  }
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
