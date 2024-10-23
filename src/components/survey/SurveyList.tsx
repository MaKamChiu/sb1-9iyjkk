import { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  Button,
  useToast,
} from '@chakra-ui/react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Survey } from '../../types';
import { Link } from 'react-router-dom';

export const SurveyList = () => {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const toast = useToast();

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'surveys'));
        const surveyData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Survey[];
        setSurveys(surveyData);
      } catch (error) {
        toast({
          title: 'Error fetching surveys',
          status: 'error',
          duration: 3000,
        });
      }
    };

    fetchSurveys();
  }, [toast]);

  return (
    <Box maxW="6xl" mx="auto" mt={8} p={6}>
      <Heading mb={6}>Available Surveys</Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {surveys.map((survey) => (
          <Box
            key={survey.id}
            p={6}
            borderWidth={1}
            borderRadius="lg"
            boxShadow="md"
          >
            <Heading size="md" mb={2}>{survey.title}</Heading>
            <Text mb={4}>{survey.description}</Text>
            <Text mb={2}>Questions: {survey.questions.length}</Text>
            <Text mb={4}>Responses: {survey.responses}</Text>
            <Button
              as={Link}
              to={`/survey/${survey.id}`}
              colorScheme="blue"
              width="full"
            >
              Take Survey
            </Button>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};