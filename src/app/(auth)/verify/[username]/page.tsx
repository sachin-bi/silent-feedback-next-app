'use client'

import { useToast } from '@/hooks/use-toast'
import { verifySchema } from '@/schemas/verifySchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'   // import Form conflict
import * as z from 'zod'

//form import
import { Button } from "@/components/ui/button"
import {
    Form,       // import Form conflict
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"



function verifyAccount() {
    const router = useRouter()
    const param = useParams<{ username: string }>()
    const { toast } = useToast()

    //zod implimentation    //TODO: NEED study
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema)
        ,
        defaultValues: {
            code: '',  // Initialize code as an empty string
        },

    })

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {

        try {
            const response = await axios.post('/api/verify-code', {
                username: param.username,
                code: data.code
            })
            // TODO: what if otp does not match

            toast({
                title: "Success",
                description: response.data.message

            })

            router.replace('/sign-in');

        } catch (err) {
            console.error("-- err in verify code of user @verify page, err:", err)
            const axiosError = err as AxiosError<ApiResponse>;
            toast({
                title: "Signup failed!",
                description: axiosError.response?.data.message,
                variant: "destructive"
            })
        }


    }



    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">

                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Verify Your Account
                    </h1>
                    <p className="mb-4">Enter the verification code sent to you email</p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            name="code"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>OTP Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="******" {...field} />
                                    </FormControl>
                                    {/* { //TODO: remove form description} */}
                                    <FormDescription>
                                        OTP valid for 1hr only.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Verify</Button>
                    </form>
                </Form>

            </div>
        </div>
    )
}

export default verifyAccount
