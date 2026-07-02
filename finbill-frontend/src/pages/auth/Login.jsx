import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';
import { Building2, ArrowRight, Lock, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [loginError, setLoginError] = useState(null);
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        setSubmitting(true);
        setLoginError(null);
        try {
            await login(data);
            toast.success('Welcome Back to FinBill!');
            navigate('/dashboard');
        } catch (error) {
            setLoginError(error.response?.data?.message || 'Invalid email or password. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-slate-100 to-indigo-50/30 px-4 select-none">
            <div className="w-full max-w-[420px] bg-white border border-slate-200/80 p-9 rounded-2xl shadow-xl shadow-slate-100 flex flex-col gap-6">
                
                {/* Brand Logo header */}
                <div className="flex flex-col items-center gap-3 text-center">
                    <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100">
                        <Building2 size={24} className="text-indigo-600" />
                    </div>
                    <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight m-0">
                        Sign in to FinBill
                    </h2>
                    <p className="text-sm text-slate-500 m-0">
                        Enter your credentials or{' '}
                        <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
                            register a workspace
                        </Link>
                    </p>
                </div>

                <form className="flex flex-col gap-4 mt-1" onSubmit={handleSubmit(onSubmit)}>
                    {/* Error Banner Callout */}
                    {loginError && (
                        <div className="bg-red-50 border border-red-100/55 text-red-600 px-4 py-3 rounded-xl text-xs font-bold leading-relaxed">
                            {loginError}
                        </div>
                    )}

                    <div className="flex flex-col gap-4">
                        {/* Email field */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-slate-700">Corporate Email</label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="email"
                                    {...register('email', { required: 'Email address is required' })}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all box-border"
                                    placeholder="name@company.com"
                                />
                            </div>
                            {errors.email && <p className="text-xs text-red-500 mt-1 m-0">{errors.email.message}</p>}
                        </div>

                        {/* Password field */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-slate-700">Security Password</label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="password"
                                    {...register('password', { required: 'Password is required' })}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all box-border"
                                    placeholder="••••••••"
                                />
                            </div>
                            {errors.password && <p className="text-xs text-red-500 mt-1 m-0">{errors.password.message}</p>}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="mt-2 w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold cursor-pointer border-none shadow-md shadow-indigo-600/10 active:scale-[0.99] disabled:opacity-50 transition-all"
                    >
                        <span>{submitting ? 'Authenticating...' : 'Sign In'}</span>
                        {!submitting && <ArrowRight size={16} />}
                    </button>
                </form>
            </div>
        </div>
    );
}
