
'use client'

import { useToast } from '@/hooks/use-toast'
import { messageSchema } from '@/schemas/messageSchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'   // import Form conflict
import * as z from 'zod'
import messagesHardcore from '@/aiMsgSuggestions.json'  //har


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

import { Separator } from '@/components/ui/separator'
import { Message } from '@/model/User'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import Link from 'next/link'




const sendMessagePage = () => {
  const [isLoadingSend, setIsLoadingSend] = useState(false)
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  // const [messageSuggested, setMessageSuggested] = useState('')
  const [fetchedMessages, setFetchedMessages] = useState(messagesHardcore)

  const param = useParams<{ username: string }>() // take out param.username
  const { toast } = useToast()



  //zod implimentation
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: '',

    },

  })

  const messageContent = form.watch('content');



  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoadingSend(true)

    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        username: param.username,
        content: data.content
      })

      if (!response.data.success) {

        toast({
          title: "Message not sent.!",
          description: response.data.message,
          variant: "destructive"
        })
      }else{

        toast({
          title: 'Message sent.!',
          description: response.data.message,
        })
        form.reset({ content: '' })
      }


    }
    catch (err) {
      console.error("-- err in verify code of user @u/username page, err:", err)
      const axiosError = err as AxiosError<ApiResponse>;
      toast({
        title: "Failed, Message not sent.!",
        description: axiosError.response?.data.message,
        variant: "destructive"
      })
    }
    finally {
      setIsLoadingSend(false)
      // setMessageSuggested("")

    }

  }

  const getSuggestMessages = async () => {
    setIsLoadingSuggestions(true)
    try {
      const response = await axios.get<ApiResponse>('/api/suggest-messages')
      // console.log(response.data);

      if (!response.data.success) {

        toast({
          title: 'Ai Not working currently.!',
          description: response.data.message,
          variant: 'destructive'
        })
      } else {

        setFetchedMessages(response.data.messages as Message[])
      }
    } catch (err) {
      console.error("-- err in getSuggestMessages code of user @u/username page, err:", err)
      const axiosError = err as AxiosError<ApiResponse>;
      toast({
        title: "Ai Not working currently.!",
        description: axiosError.response?.data.message,
        variant: "destructive"
      })
    }
    finally {
      setIsLoadingSuggestions(false)
    }
  }
  const selectSuggestion = (content: string) => {

    form.setValue('content', content);

    // setMessageSuggested(content)

  }

  // useEffect to update form value when messageSuggested changes
  // useEffect(() => {

  //   // form.reset({content:''})
  //   form.setValue('content', messageSuggested);

  // }, [messageSuggested, form]);


  return (
    <>
      <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
        <h1 className="text-4xl font-bold mb-6 text-center">
          Public Profile Link
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="content"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Send Anonymous Message to @{param.username}:</FormLabel>
                  <FormControl>
                    {/* <Input placeholder="type msg here!" {...field} /> */}
                    <Textarea
                      placeholder="Write your anonymous message here"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  {/* <FormDescription>
                  This is your public display name.-form description..
                </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-center">
              {isLoadingSend ? (
                <Button disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait..
                </Button>
              ) : (
                <Button type="submit" disabled={isLoadingSend || !messageContent}>
                  Send It
                </Button>
              )}
            </div>
          </form>
        </Form>
        {/* </div> */}

        <Separator className='mt-6' />


        <div className="space-y-4 my-8">
          <div className="space-y-2">
            {
              isLoadingSuggestions ? (
                <Button disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Ai Generating..
                </Button>
              ) : (

                <Button
                  onClick={getSuggestMessages}
                  className="my-4"
                  disabled={isLoadingSuggestions}
                >
                  Suggest Messages
                </Button>
              )
            }
            <p>Click on any message below to select it.</p>
          </div>

          {/* <Button className='m-4' disabled={isLoadingSuggestions} onClick={() => getSuggestMessages()}> Generate Suggestions</Button> */}
          <Card>
            <CardHeader >
              <h3 className="text-xl font-semibold">Messages</h3>
            </CardHeader>
            <CardContent className="flex flex-col space-y-4">
              {
                fetchedMessages.map((msg, index) => (
                  <Button variant="outline" key={index} onClick={() => { selectSuggestion(msg.content) }}>

                    <input
                      type="text"
                      value={msg.content}
                      // disabled
                      readOnly  // makes it non-editable but clickable
                      className="input input-bordered w-full p-2 mr-2 cursor-pointer bg-transparent"
                    />
                  </Button>

                ))
              }
            </CardContent>
          </Card>
        </div>
        <Separator className="my-6" />
        <div className="text-center">
          <div className="mb-4">Get Your Message Board</div>
          <Link href={'/sign-up'}>
            <Button>Create Your Account</Button>
          </Link>
        </div>
      </div >



    </>
  )
}

export default sendMessagePage
