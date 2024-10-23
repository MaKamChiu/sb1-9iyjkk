import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Select,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuthStore } from '../../store/authStore';
import { Question } from '../../types';

export const CreateSurvey = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const user = useAuthStore((state) => state.user);
  const toast = useToast();

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: Date.now().toString(),
        type: 'single-choice',
        text: '',
        required: false,
        options: [''],
      },
    ]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await addDoc(collection(db, 'surveys'), {
        title,
        description,
        questions,
        createdBy: user.id,
        createdAt: new Date(),
        responses: 0,
      });

      toast({
        title: 'Survey created successfully',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Error creating survey',
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <Box maxW="2xl" mx="auto" mt={8} p={6} borderWidth={1} borderRadius="lg">
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Title</FormLabel>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormControl>

          {questions.map((question, index) => (
            <Box key={question.id} p={4} borderWidth={1} borderRadius="md" w="full">
              <FormControl isRequired>
                <FormLabel>Question {index + 1}</FormLabel>
                <Input
                  value={question.text}
                  onChange={(e) => {
                    const newQuestions = [...questions];
                    newQuestions[index].text = e.target.value;
                    setQuestions(newQuestions);
                  }}
                />
              </FormControl>

              <FormControl mt={2}>
                <FormLabel>Question Type</FormLabel>
                <Select
                  value={question.type}
                  onChange={(e) => {
                    const newQuestions = [...questions];
                    newQuestions[index].type = e.target.value as 'single-choice' | 'fill-in';
                    setQuestions(newQuestions);
                  }}
                >
                  <option value="single-choice">Single Choice</option>
                  <option value="fill-in">Fill In</option>
                </Select>
              </FormControl>
            </Box>
          ))}

          <Button onClick={addQuestion} colorScheme="green">
            Add Question
          </Button>

          <Button type="submit" colorScheme="blue" width="full">
            Create Survey
          </Button>
        </VStack>
      </form>
    </Box>
  );
};