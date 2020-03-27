import React, { useState, useEffect } from 'react';
import { Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import api from '../../services/api';

import logo from '../../assets/logo.png';
import {
  Container,
  Header,
  HeaderText,
  HeaderTextBold,
  Title,
  Description,
  IncidentsList,
  Incident,
  IncidentProperty,
  IncidentValue,
  ViewMore,
  ButtonText,
} from './styles';

export default function Incidents() {
  const [incidents, setIncidents] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  function navigateToDetail(incident) {
    navigation.navigate('Detail', { incident });
  }

  async function loadIncidents() {
    if (loading) {
      return;
    }

    if (total > 0 && incidents.length === total) {
      return;
    }

    setLoading(true);

    const response = await api.get('/incidents', { params: { page } });
    setIncidents([...incidents, ...response.data]);
    setTotal(response.headers['x-total-count']);

    setPage(page + 1);
    setLoading(false);
  }

  useEffect(() => {
    loadIncidents();
  }, []);

  return (
    <Container>
      <Header>
        <Image source={logo} />
        <HeaderText>
          Total de <HeaderTextBold>{total} casos</HeaderTextBold>
        </HeaderText>
      </Header>

      <Title>Bem-Vindo</Title>
      <Description>Escolha um dos casos abaixo e salve o dia!</Description>

      <IncidentsList
        data={incidents}
        keyExtractor={incident => incident.id}
        showsVerticalScrollIndicator={false}
        onEndReached={loadIncidents}
        onEndReachedThreshold={0.2}
        renderItem={({ item: incident }) => (
          <Incident>
            <IncidentProperty>ONG:</IncidentProperty>
            <IncidentValue>{incident.name}</IncidentValue>

            <IncidentProperty>CASO:</IncidentProperty>
            <IncidentValue>{incident.title}</IncidentValue>

            <IncidentProperty>VALOR:</IncidentProperty>
            <IncidentValue>
              {Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(incident.value)}
            </IncidentValue>

            <ViewMore onPress={() => navigateToDetail(incident)}>
              <ButtonText>Ver mais detalhes</ButtonText>
              <Feather name="arrow-right" size={16} color="#E02041" />
            </ViewMore>
          </Incident>
        )}
      />
    </Container>
  );
}
