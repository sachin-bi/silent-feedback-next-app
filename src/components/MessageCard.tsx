'use client'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "./ui/button"
import { X } from "lucide-react"
import { Message } from "@/model/User"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"
import { ApiResponse } from "@/types/ApiResponse"

import dayjs from 'dayjs'


type MessageCardProps = {
    message: Message;
    onMessageDelete: (messageId: string) => void
}

function MessageCard({ message, onMessageDelete }: MessageCardProps) {

    const { toast } = useToast()
    const handleDeleteConfirm = async () => {

        const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
        toast({
            title: response.data.message
        })
        // watch out
        onMessageDelete(message._id + "")
    }

    return (
        <Card>
            <CardHeader>

                <div className="flex justify-between items-center">
                    <CardTitle>{message.content}</CardTitle>


                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" > <X className="w-5 h-5" /> </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your
                                    message.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                </div>
                <div className="text-sm">
                    {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
                </div>

                {/* <CardDescription>Card Description</CardDescription> */}
            </CardHeader>
            {/* <CardContent>
                <p>Card Content</p> 
            </CardContent> */}
            {/*  <CardFooter>
                <p>Card Footer</p>
            </CardFooter> */}
        </Card>

    )
}

export default MessageCard
