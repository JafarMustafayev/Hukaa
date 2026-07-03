// src/pages/auth/Register.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { validateEmail, isAtLeast16 } from '../../utils/validation';
import { checkUsername, checkEmail } from '../../api/account.api';
import { register } from '../../api/auth.api';
import { toast } from 'react-hot-toast';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthCard from '../../components/auth/AuthCard';
import AuthInput from '../../components/auth/AuthInput';
import AuthButton from '../../components/auth/AuthButton';
import RegisterStepIndicator from '../../components/auth/RegisterStepIndicator';

const Register = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        birthDate: null,
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const [availability, setAvailability] = useState({
        username: { isAvailable: true, message: '', checking: false },
        email: { isAvailable: true, message: '', checking: false }
    });

    useEffect(() => {
        document.title = "Register";
    }, []);

    useEffect(() => {
        if (currentStep !== 3 || !formData.username.trim()) return;

        setAvailability(prev => ({ ...prev, username: { ...prev.username, checking: true, isAvailable: true, message: '' } }));

        const timer = setTimeout(async () => {
            const result = await checkUsername(formData.username.trim());
            if (result.success || result.Success) {
                const isAvailable = result.data?.isAvailable ?? result.Data?.isAvailable ?? true;
                setAvailability(prev => ({
                    ...prev,
                    username: {
                        isAvailable: isAvailable,
                        message: isAvailable ? '' : 'This username is already taken.',
                        checking: false
                    }
                }));
            } else {
                setAvailability(prev => ({
                    ...prev,
                    username: { isAvailable: false, message: result.message || result.Message || 'Error checking username.', checking: false }
                }));
            }
        }, 750);

        return () => clearTimeout(timer);
    }, [formData.username, currentStep]);

    useEffect(() => {
        if (currentStep !== 4 || !formData.email.trim() || !validateEmail(formData.email)) return;

        setAvailability(prev => ({ ...prev, email: { ...prev.email, checking: true, isAvailable: true, message: '' } }));

        const timer = setTimeout(async () => {
            const result = await checkEmail(formData.email.trim());
            if (result.success || result.Success) {
                const isAvailable = result.data?.isAvailable ?? result.Data?.isAvailable ?? true;
                setAvailability(prev => ({
                    ...prev,
                    email: {
                        isAvailable: isAvailable,
                        message: isAvailable ? '' : 'This email is already registered.',
                        checking: false
                    }
                }));
            } else {
                setAvailability(prev => ({
                    ...prev,
                    email: { isAvailable: false, message: result.message || result.Message || 'Error checking email.', checking: false }
                }));
            }
        }, 750);

        return () => clearTimeout(timer);
    }, [formData.email, currentStep]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const nextStep = () => {
        const data = {
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
            username: formData.username.trim(),
            email: formData.email.trim(),
        };

        if (currentStep === 1) {
            if (!data.firstName || !data.lastName) {
                toast.error('Please enter both first and last name.');
                return;
            }
        } else if (currentStep === 2) {
            if (!formData.birthDate) {
                toast.error('Please select your birth date.');
                return;
            }
            if (!isAtLeast16(formData.birthDate)) {
                toast.error('You must be at least 16 years old to register.');
                return;
            }
        } else if (currentStep === 3) {
            if (!data.username) {
                toast.error('Please enter a username.');
                return;
            }
            if (!availability.username.isAvailable) {
                toast.error(availability.username.message || 'This username is not available.');
                return;
            }
            if (availability.username.checking) {
                toast.error('Please wait while we check username availability.');
                return;
            }
        } else if (currentStep === 4) {
            if (!data.email) {
                toast.error('Please enter your email.');
                return;
            }
            if (!validateEmail(data.email)) {
                toast.error('Please enter a valid email address.');
                return;
            }
            if (!availability.email.isAvailable) {
                toast.error(availability.email.message || 'This email is already in use.');
                return;
            }
            if (availability.email.checking) {
                toast.error('Please wait while we check email availability.');
                return;
            }
        }

        setCurrentStep(prev => prev + 1);
    };

    const prevStep = () => {
        setCurrentStep(prev => prev - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match.');
            return;
        }

        const payload = {
            UserName: formData.username.trim(),
            email: formData.email.trim(),
            password: formData.password.trim(),
            DateOfBirth: formData.birthDate ? formData.birthDate.toLocaleDateString("en-CA") : null,
            FirstName: formData.firstName.trim(),
            LastName: formData.lastName.trim()
        };

        setIsLoading(true);
        try {
            const result = await register(payload);

            if (result.success || result.Success) {
                toast.success(result.message || result.Message || 'Successfully registered.');
                navigate('/auth/login');
            }
        } catch (error) {
            console.error('Registration failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <AuthInput
                            label="First Name"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            placeholder="e.g. John"
                        />
                        <AuthInput
                            label="Last Name"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Doe"
                        />
                    </div>
                );
            case 2:
                return (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="mb-4">
                            <label className="block text-[14px] font-medium text-gray-700 dark:text-gray-300 mb-1.5 ml-1">
                                Birth Date
                            </label>
                            <DatePicker
                                selected={formData.birthDate}
                                onChange={(date) => {
                                    setFormData(prev => ({ ...prev, birthDate: date }));
                                }}
                                dateFormat="dd/MM/yyyy"
                                showYearDropdown
                                scrollableYearDropdown
                                yearDropdownItemNumber={100}
                                autoComplete='on'
                                placeholderText="DD/MM/YYYY"
                                className="w-full h-[46px] px-4 rounded-xl text-[15px] transition-colors bg-gray-50 dark:bg-[#09090b] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 focus:border-main focus:ring-1 focus:ring-main focus:outline-none placeholder-gray-400 dark:placeholder-gray-600"
                                wrapperClassName="w-full"
                                required
                            />
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <AuthInput
                            label="Username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            placeholder="Choose a username"
                            error={!availability.username.isAvailable ? availability.username.message : ''}
                        />
                        {availability.username.checking && (
                            <span className="text-gray-500 text-xs ml-1 block font-light">Checking availability...</span>
                        )}
                    </div>
                );
            case 4:
                return (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <AuthInput
                            label="Email Address"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter your email"
                            error={!availability.email.isAvailable ? availability.email.message : ''}
                        />
                        {availability.email.checking && (
                            <span className="text-gray-500 text-xs ml-1 block font-light">Checking availability...</span>
                        )}
                    </div>
                );
            case 5:
                return (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <AuthInput
                            label="Password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Create a password"
                        />
                        <AuthInput
                            label="Confirm Password"
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            placeholder="Confirm your password"
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <AuthLayout>
            <AuthCard title="Create an account" subtitle="Join Tetra today.">
                <RegisterStepIndicator currentStep={currentStep} totalSteps={5} />

                <form onSubmit={handleSubmit} className="w-full">
                    {renderStep()}

                    <div className="flex gap-3 mt-8">
                        {currentStep > 1 && (
                            <button
                                type="button"
                                onClick={prevStep}
                                className="w-1/3 h-[46px] rounded-full font-bold text-[15px] flex items-center justify-center transition-all bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
                            >
                                Back
                            </button>
                        )}

                        {currentStep < 5 ? (
                            <AuthButton
                                type="button"
                                className={currentStep > 1 ? "w-2/3" : "w-full"}
                                disabled={
                                    (currentStep === 3 && (!availability.username.isAvailable || availability.username.checking))
                                    || (currentStep === 4 && (!availability.email.isAvailable || availability.email.checking))
                                }
                                onClick={nextStep}
                            >
                                Next
                            </AuthButton>
                        ) : (
                            <AuthButton
                                type="submit"
                                className={currentStep > 1 ? "w-2/3" : "w-full"}
                                isLoading={isLoading}
                            >
                                Sign up
                            </AuthButton>
                        )}
                    </div>

                    <div className="mt-6 text-center">
                        <span className="text-[14px] text-gray-500">Already have an account? </span>
                        <Link
                            to="/auth/login"
                            className="text-[14px] text-main hover:underline font-bold"
                        >
                            Log in
                        </Link>
                    </div>
                </form>
            </AuthCard>
        </AuthLayout>
    );
};

export default Register;
