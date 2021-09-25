import * as React from 'react';
import { Card, Container, Icon, Text } from '@src/components/elements';
import PlaceCardInfo from '@src/components/common/PlaceCardInfo';
import styles from './styles';
import { Place } from '@src/data/mock-places';

type HeadingInformationProps = {
  data: Place;
};

const HeadingInformation: React.FC<HeadingInformationProps> = ({ data }) => {
  const { name, description } = data;

  return (
    <Card
      isSmallCover
      title={name}
      subTitle={description}
      titleStyle={styles.title}
      style={styles.headingContainer}>
      <PlaceCardInfo data={data} />
      <Container style={styles.infoSection}>
        <Text style={styles.label}>مفتوح من </Text>
        <Text>{`${data.Working_hours_from} - ${data.Working_hours_to}`}</Text>
      </Container>
      <Container style={styles.infoSection}>
        <Text style={styles.label}>العنوان</Text>
        <Container style={styles.coupon}>
          <Text>{data?.address}</Text>
        </Container>
      </Container>
      <Container style={styles.infoSection}>
        <Text style={styles.label}>التليفون</Text>
        <Container style={styles.coupon}>
          <Text>{data?.phone_num1} {data?.phone_num2 ? ` - ${data?.phone_num2}` : ''}</Text>
        </Container>
      </Container>
      {/* <Container style={styles.infoSection}>
        <Text style={styles.label}>كوبون خصم</Text>
        <Container>
          <Container style={styles.coupon}>
            <Icon name="tag" style={styles.couponIcon} isPrimary />
            <Text isPrimary>35% off for Cheese Burger</Text>
          </Container>
          <Container style={styles.coupon}>
            <Icon name="tag" style={styles.couponIcon} isPrimary />
            <Text isPrimary>5% off for all items</Text>
          </Container>
        </Container>
      </Container> */}
    </Card>
  );
};

export default HeadingInformation;
