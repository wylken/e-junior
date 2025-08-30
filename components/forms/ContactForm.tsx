'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';

const contactSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  message: z.string().min(10, 'Mensagem deve ter pelo menos 10 caracteres'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitStatus('success');
        reset();
        setTimeout(() => setSubmitStatus('idle'), 5000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full shadow-xl border-0">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-bold text-[#003366]">
          Entre em Contato Conosco
        </CardTitle>
        <p className="text-gray-600 mt-2">
          Preencha o formulário abaixo e retornaremos em breve
        </p>
      </CardHeader>
      
      <CardContent>
        {submitStatus === 'success' && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
            <p className="text-green-700">Mensagem enviada com sucesso! Retornaremos em breve.</p>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
            <p className="text-red-700">Erro ao enviar mensagem. Tente novamente ou nos contate por telefone.</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[#003366] font-medium">Nome Completo *</Label>
              <Input
                id="name"
                {...register('name')}
                className="border-gray-300 focus:border-[#1E90FF] focus:ring-[#1E90FF]/20"
                placeholder="Seu nome completo"
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-[#003366] font-medium">Telefone *</Label>
              <Input
                id="phone"
                {...register('phone')}
                className="border-gray-300 focus:border-[#1E90FF] focus:ring-[#1E90FF]/20"
                placeholder="(11) 99999-9999"
              />
              {errors.phone && (
                <p className="text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#003366] font-medium">Email *</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              className="border-gray-300 focus:border-[#1E90FF] focus:ring-[#1E90FF]/20"
              placeholder="seu@email.com"
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message" className="text-[#003366] font-medium">Mensagem *</Label>
            <Textarea
              id="message"
              {...register('message')}
              rows={5}
              className="border-gray-300 focus:border-[#1E90FF] focus:ring-[#1E90FF]/20 resize-none"
              placeholder="Descreva seu problema ou dúvida..."
            />
            {errors.message && (
              <p className="text-sm text-red-600">{errors.message.message}</p>
            )}
          </div>
          
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-[#0093e9] to-[#1E90FF] hover:from-[#007acc] hover:to-[#1874CD] text-white border-0 font-semibold py-3 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                Enviando...
              </>
            ) : (
              <>
                <Send className="h-5 w-5 mr-2" />
                Enviar Mensagem
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}