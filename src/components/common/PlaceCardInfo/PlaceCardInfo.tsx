import * as React from 'react';
import { View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Rating, Button, Icon, Text } from '@src/components/elements';
import { Resturant } from '@src/data/mock-places';
import styles from './styles';

type PlaceCardInfoProps = {
  data: Resturant;
  ratingStarBackgroundColor?: string;
};
const PlaceCardInfo: React.FC<PlaceCardInfoProps> = ({
  data,
  ratingStarBackgroundColor,
}) => {
  const { distance_, rating, ShippingCost } = data;
  const {
    colors: { border },
  } = useTheme();
  return (
    <View style={styles.container}>
      <View style={styles.ratingContainer}>
        <Rating value={rating || 5} itemSize={16} readonly ratingStarBackgroundColor={ratingStarBackgroundColor} />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          style={[styles.button, { backgroundColor: '#fff' }]}
          icon={<Icon isPrimary name="bicycle" size={10} />}>
          <Text isPrimary style={styles.buttonText}>{`${ShippingCost} EGP`}</Text>
        </Button>
        {/* <Button
          style={[styles.button, { backgroundColor: '#fff' }]}
          icon={<Icon isPrimary name="map-marker-alt" size={10} />}>
          <Text isPrimary style={styles.buttonText}>{`${distance_}m`}</Text>
        </Button> */}
        <Button
          style={[styles.button, { backgroundColor: '#fff' }]}
          icon={<Icon isPrimary name="clock" size={10} />}>
          <Text isPrimary style={styles.buttonText}>{`${data.deliveryTimeFrom} : ${data.deliveryTimeTo}'`}</Text>
        </Button>
      </View>
    </View>
  );
};

export default PlaceCardInfo;
