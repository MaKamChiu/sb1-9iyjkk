import { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
} from '@chakra-ui/react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuthStore } from '../../store/authStore';
import { Survey, Response } from '../../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export const Dashboard = () => {
  const user = useAuthStore((state) => state.user);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [responses, setResponses] = useState<Response[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      const surveysQuery = query(
        collection(db, 'surveys'),
        where('createdBy', '==', user.id)
      );

      const responsesQuery = query(
        collection(db, 'responses'),
        where('userId', '==', user.id)
      );

      const [surveysSnapshot, responsesSnapshot] = await Promise.all([
        getDocs(surveysQuery),
        getDocs(responsesQuery),
      ]);

      setSurveys(surveysSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Survey[]);
      setResponses(responsesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Response[]);
    };

    fetchUserData();
  }, [user]);

  const chartData = surveys.map(survey => ({
    name: survey.title,
    responses: survey.responses,
  }));

  return (
    <Box maxW="6xl" mx="auto" mt={8} p={6}>
      <Heading mb={6}>Dashboard</Heading>

      <StatGroup mb={8}>
        <Stat>
          <StatLabel>Total Surveys Created</StatLabel>
          <StatNumber>{surveys.length}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Total Responses</StatLabel>
          <StatNumber>{responses.length}</StatNumber>
        </Stat>
      </StatGroup>

      <Box height="400px" mb={8}>
        <Heading size="md" mb={4}>Survey Responses Overview</Heading>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="responses" fill="#3182CE" />
          </BarChart>
        </ResponsiveContainer>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        {surveys.map((survey) => (
          <Box
            key={survey.id}
            p={6}
            borderWidth={1}
            borderRadius="lg"
            boxShadow="md"
          >
            <Heading size="md" mb={2}>{survey.title}</Heading>
            <Stat>
              <StatLabel>Responses</StatLabel>
              <StatNumber>{survey.responses}</StatNumber>
            </Stat>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};