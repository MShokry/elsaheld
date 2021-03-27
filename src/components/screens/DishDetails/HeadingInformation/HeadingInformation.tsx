import * as React from 'react';
import { Container, Text } from '@src/components/elements';
import { Dish } from '@src/data/mock-places';
import styles from './styles';

type HeadingInformationProps = {
  data: Dish;
};

const HeadingInformation: React.FC<HeadingInformationProps> = ({ data }) => {
  const { name, price, description } = data;
  return (
    <Container style={styles.headingContainer}>
      <Container style={styles.titleContainer}>
        <Text style={styles.title}>{name}</Text>
        <Text isPrimary style={styles.title}>
          ${price}
        </Text>
      </Container>
      <Text style={styles.description}>{description}</Text>
    </Container>
  );
};

export default HeadingInformation;
