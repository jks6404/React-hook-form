import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import './SignupForm.css';

const fetchUsers = async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/users');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const SignupForm = () => {
  const { register, handleSubmit, formState: { errors }, setError } = useForm();

  const { data: users = [], isLoading, isError } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  const mutation = useMutation({
    mutationFn: async (data) => {
      const response = await fetch('https://jsonplaceholder.typicode.com/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Signup failed');
      }

      return response.json();
    },
  });

  const onSubmit = async (data) => {
    const emailExists = users.some((user) => user.email === data.email);
    if (emailExists) {
      setError('email', {
        type: 'manual',
        message: 'You are already registered',
      });
    } else {
      console.log('Form data:', data);
      mutation.mutate(data);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading data</div>;

  return (
    <div className="container">
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <h2 className="heading">Sign Up</h2>
        <div className="input-group">
          <label htmlFor="username" className="label">Username</label>
          <input id="username" {...register('username', { required: 'Username is required' })} className="input"/>
          {errors.username && <p className="error">{errors.username.message}</p>}
        </div>
        <div className="input-group">
          <label htmlFor="email" className="label">Email</label>
          <input id="email" {...register('email', { required: 'Email is required', pattern: { value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/, message: 'Email is not valid' } })} className="input"/>
          {errors.email && <p className="error">{errors.email.message}</p>}
        </div>
        <div className="input-group">
          <label htmlFor="password" className="label">Password</label>
          <input id="password" type="password" {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })} className="input"/>
          {errors.password && <p className="error">{errors.password.message}</p>}
        </div>
        <button type="submit" className="button" disabled={mutation.isLoading}>
          {mutation.isLoading ? 'Signing up...' : 'Sign Up'}
        </button>
        {mutation.isError && <p className="error">Signup failed</p>}
        {mutation.isSuccess && <p className="success">Signup successful!</p>}
      </form>
    </div>
  );
};

export default SignupForm;
