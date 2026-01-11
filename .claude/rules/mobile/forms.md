# Mobile: Forms

## Stack

- **Form Library:** React Hook Form
- **Validation:** Zod
- **Integration:** @hookform/resolvers
- **UI Components:** Custom TextInput + Error display

## Basic Form Pattern

**File:** `mobile/src/features/auth/hooks/useForm.ts`

```typescript
import { useForm as useReactHookForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers';
import type { UseFormProps } from 'react-hook-form';
import type { z } from 'zod';

export function useForm<T extends z.ZodType<any, any, any>>(
  props: {
    schema: T;
    defaultValues?: z.infer<T>;
    mode?: 'onSubmit' | 'onChange' | 'onBlur' | 'onTouched' | 'all';
  }
) {
  return useReactHookForm<z.infer<T>>({
    resolver: zodResolver(props.schema) as any,
    mode: props.mode ?? 'onChange',
    defaultValues: props.defaultValues,
  });
}
```

## Validation Schemas

**File:** `mobile/src/features/auth/schemas/auth.schema.ts`

```typescript
import { z } from 'zod';
import { i18n } from '@/shared/i18n';

const t = i18n.t.bind(i18n);

// Common validation patterns
const emailSchema = z.string().email(t('validation:emailInvalid'));
const passwordSchema = z.string().min(8, t('validation:passwordMin', { min: 8 }));

// Login schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, t('validation:required')),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Register schema
export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: t('validation:passwordMatch'),
  path: ['confirmPassword'],
});

export type RegisterFormData = z.infer<typeof registerSchema>;
```

## Form Component Pattern

```typescript
import { View } from 'react-native';
import { useForm } from '@/features/auth/hooks/useForm';
import { loginSchema, type LoginFormData } from '@/features/auth/schemas/auth.schema';
import { TextInput } from '@/shared/components/ui/TextInput';
import { Button } from '@/shared/components/ui/Button';
import Toast from 'react-native-toast-message';
import { useLogin } from '@/features/auth/hooks/useAuth';

export function LoginForm() {
  const loginMutation = useLogin();

  const form = useForm({
    schema: loginSchema,
    defaultValues: { email: '', password: '' },
  });

  const handleSubmit = async (data: LoginFormData) => {
    try {
      await loginMutation.mutateAsync(data);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: (error as Error).message,
      });
    }
  };

  return (
    <View>
      <TextInput
        label="Email"
        placeholder="you@example.com"
        value={form.watch('email')}
        onChangeText={(text) => form.setValue('email', text)}
        error={form.formState.errors.email?.message}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        label="Password"
        placeholder="••••••••"
        value={form.watch('password')}
        onChangeText={(text) => form.setValue('password', text)}
        error={form.formState.errors.password?.message}
        secureTextEntry
      />

      <Button
        title="Login"
        onPress={form.handleSubmit(handleSubmit)}
        loading={loginMutation.isPending}
        disabled={loginMutation.isPending}
      />
    </View>
  );
}
```

## Complex Form Examples

### Multi-Step Form

```typescript
const step1Schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Min 8 characters'),
});

const step2Schema = z.object({
  firstName: z.string().min(2, 'Min 2 characters'),
  lastName: z.string().min(2, 'Min 2 characters'),
});

const fullSchema = step1Schema.merge(step2Schema);

export function MultiStepForm() {
  const [step, setStep] = useState(1);
  const form = useForm({
    schema: fullSchema,
    mode: 'onBlur',
  });

  const nextStep = async () => {
    const fields = step === 1
      ? (['email', 'password'] as const)
      : (['firstName', 'lastName'] as const);

    const isValid = await form.trigger(fields);
    if (isValid) setStep((s) => s + 1);
  };

  return (
    <View>
      {step === 1 && (
        <>
          <TextInput
            label="Email"
            {...form.register('email')}
            error={form.formState.errors.email?.message}
          />
          <TextInput
            label="Password"
            secureTextEntry
            {...form.register('password')}
            error={form.formState.errors.password?.message}
          />
          <Button title="Next" onPress={nextStep} />
        </>
      )}

      {step === 2 && (
        <>
          <TextInput
            label="First Name"
            {...form.register('firstName')}
            error={form.formState.errors.firstName?.message}
          />
          <TextInput
            label="Last Name"
            {...form.register('lastName')}
            error={form.formState.errors.lastName?.message}
          />
          <Button title="Back" onPress={() => setStep(1)} />
          <Button title="Submit" onPress={form.handleSubmit(onSubmit)} />
        </>
      )}
    </View>
  );
}
```

### Dynamic Fields (Array)

```typescript
const taskSchema = z.object({
  title: z.string().min(1, 'Required'),
  subtasks: z.array(
    z.object({
      text: z.string().min(1, 'Required'),
      completed: z.boolean(),
    })
  ).optional(),
});

export function TaskForm() {
  const form = useForm({
    schema: taskSchema,
    defaultValues: {
      title: '',
      subtasks: [{ text: '', completed: false }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'subtasks',
  });

  return (
    <View>
      <TextInput
        label="Task Title"
        {...form.register('title')}
        error={form.formState.errors.title?.message}
      />

      {fields.map((field, index) => (
        <View key={field.id} style={{ flexDirection: 'row', gap: 8 }}>
          <TextInput
            label={`Subtask ${index + 1}`}
            {...form.register(`subtasks.${index}.text`)}
            error={form.formState.errors.subtasks?.[index]?.text?.message}
            style={{ flex: 1 }}
          />
          <Button title="Remove" onPress={() => remove(index)} />
        </View>
      ))}

      <Button
        title="Add Subtask"
        variant="outline"
        onPress={() => append({ text: '', completed: false })}
      />

      <Button title="Submit" onPress={form.handleSubmit(onSubmit)} />
    </View>
  );
}
```

### File Upload

```typescript
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

const avatarSchema = z.object({
  avatar: z.any().refine((files) => files?.length > 0, 'Avatar required'),
});

export function ProfileForm() {
  const [avatar, setAvatar] = useState<string | null>(null);
  const form = useForm({
    schema: avatarSchema,
  });

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
      form.setValue('avatar', result.assets);
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={pickImage}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={{ width: 100, height: 100, borderRadius: 50 }} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text>Add Photo</Text>
          </View>
        )}
      </TouchableOpacity>

      <Button title="Save" onPress={form.handleSubmit(onSubmit)} />
    </View>
  );
}
```

## Form Integration with React Query

```typescript
import { useMutation } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

export function useCreateTask() {
  return useMutation({
    mutationFn: tasksApi.create,
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Task created successfully',
      });
    },
    onError: (error: unknown) => {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: (error as { message?: string }).message || 'Failed to create task',
      });
    },
  });
}
```

## Form State Management

```typescript
// Check if form is dirty
const isDirty = form.formState.isDirty;

// Check specific field errors
const emailError = form.formState.errors.email?.message;

// Check if form is valid
const isValid = form.formState.isValid;

// Check if submitting
const isSubmitting = form.formState.isSubmitting;

// Watch specific field
const email = form.watch('email');

// Set field value
form.setValue('email', 'new@email.com');

// Set error manually
form.setError('email', {
  type: 'manual',
  message: 'This email is already taken',
});

// Clear errors
form.clearErrors('email');

// Reset form
form.reset();

// Reset to specific values
form.reset({ email: 'default@email.com', password: '' });
```

## Validation Modes

```typescript
const form = useForm({
  mode: 'onSubmit',    // Validate on submit (default)
  mode: 'onBlur',      // Validate when field loses focus
  mode: 'onChange',    // Validate on every change (performance cost)
  mode: 'onTouched',   // Validate after field is touched
  mode: 'all',         // Validate on blur and change

  reValidateMode: 'onChange', // Re-validate on change after first submit
});
```

## Server-Side Validation

```typescript
const onSubmit = async (data: CreateUserData) => {
  try {
    await api.createUser(data);
  } catch (error) {
    if (error.response?.data?.errors) {
      // Map server errors to form fields
      Object.entries(error.response.data.errors).forEach(([field, message]) => {
        form.setError(field as any, {
          type: 'server',
          message: message as string,
        });
      });
    }
  }
};
```

## Best Practices

### ✅ DO

- Use Zod for type-safe validation
- Define schemas outside components
- Handle loading/error states
- Reset form after successful submission
- Provide helpful error messages
- Use appropriate validation modes
- Implement server-side validation fallback

### ❌ DON'T

- Validate on every keystroke unless necessary
- Forget to handle submission errors
- Use uncontrolled inputs with React Hook Form
- Skip error messages
- Over-complicate validation
- Duplicate validation logic
