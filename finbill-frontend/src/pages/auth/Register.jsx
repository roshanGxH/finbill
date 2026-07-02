import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';
import { Building2, ArrowRight, Lock, Mail, User, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Register() {
    const { register: registerTenant } = useAuth();
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const firstPassword = watch("password");

    const onSubmit = async (data) => {
        setSubmitting(true);
        try {
            const payload = {
                company_name: data.company_name,
                tax_id: data.tax_id,
                name: data.name,
                email: data.email,
                password: data.password
            };
            await registerTenant(payload);
            toast.success('Company and User registered successfully! Please log in.');
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-slate-100 to-indigo-50/30 px-4 py-8 select-none">
            <div className="w-full max-w-[560px] bg-white border border-slate-200/80 p-9 rounded-2xl shadow-xl shadow-slate-100 flex flex-col gap-6">
                
                {/* Brand Logo header */}
                <div className="flex flex-col items-center gap-3 text-center">
                    <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100">
                        <Building2 size={24} className="text-indigo-600" />
                    </div>
                    <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight m-0">
                        Create Workspace
                    </h2>
                    <p className="text-sm text-slate-500 m-0">
                        Setup your multi-tenant environment or{' '}
                        <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
                            log in to your space
                        </Link>
                    </p>
                </div>

                <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Company Name */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-slate-700">Company Name</label>
                            <div className="relative">
                                <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    {...register('company_name', { required: 'Company name is required' })}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all box-border"
                                    placeholder="Fintech Inc"
                                />
                            </div>
                            {errors.company_name && <p className="text-xs text-red-500 mt-1 m-0">{errors.company_name.message}</p>}
                        </div>

                        {/* Tax ID */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-slate-700">Tax ID (GSTIN / VAT)</label>
                            <div className="relative">
                                <ShieldAlert size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    {...register('tax_id', { required: 'Tax ID is required' })}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all box-border"
                                    placeholder="GSTIN987654"
                                />
                            </div>
                            {errors.tax_id && <p className="text-xs text-red-500 mt-1 m-0">{errors.tax_id.message}</p>}
                        </div>

                        {/* Admin Name */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-slate-700">Administrator Name</label>
                            <div className="relative">
                                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    {...register('name', { required: 'Admin name is required' })}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all box-border"
                                    placeholder="Roshan Kumar"
                                />
                            </div>
                            {errors.name && <p className="text-xs text-red-500 mt-1 m-0">{errors.name.message}</p>}
                        </div>

                        {/* Email Address */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-slate-700">Work Email</label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="email"
                                    {...register('email', { required: 'Email address is required' })}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all box-border"
                                    placeholder="roshan@company.com"
                                />
                            </div>
                            {errors.email && <p className="text-xs text-red-500 mt-1 m-0">{errors.email.message}</p>}
                        </div>

                        {/* Password */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-slate-700">Security Password</label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="password"
                                    {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Must be at least 6 characters' } })}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all box-border"
                                    placeholder="••••••••"
                                />
                            </div>
                            {errors.password && <p className="text-xs text-red-500 mt-1 m-0">{errors.password.message}</p>}
                        </div>

                        {/* Confirm Password */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-slate-700">Confirm Password</label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="password"
                                    {...register('confirm_password', { 
                                        required: 'Please confirm password',
                                        validate: value => value === firstPassword || 'Passwords do not match'
                                    })}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all box-border"
                                    placeholder="••••••••"
                                />
                            </div>
                            {errors.confirm_password && <p className="text-xs text-red-500 mt-1 m-0">{errors.confirm_password.message}</p>}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="mt-4 w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold cursor-pointer border-none shadow-md shadow-indigo-600/10 active:scale-[0.99] disabled:opacity-50 transition-all"
                    >
                        <span>{submitting ? 'Registering Workspace...' : 'Register Company'}</span>
                        {!submitting && <ArrowRight size={16} />}
                    </button>
                </form>
            </div>
        </div>
    );
}
