"use client";
import { Heading } from "@/components/heading"
import { Code } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import ReactMarkdown from "react-markdown"
import { ChatCompletionRequestMessage } from "openai"

import * as z from "zod";
import { formSchema } from "./constants"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/user-avatar";
import { BotAvatar } from "@/components/bot-avator";
import { useProModel } from "@/hooks/use-pro-model";
import { toast } from "react-hot-toast"

const CodePage = () => {
  const proModel = useProModel();
  const router = useRouter();
  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: ""
    }
  })

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const userMessage: ChatCompletionRequestMessage = {
        role: "user",
        content: values.prompt,
      };
      const newMessages = [...messages, userMessage]

      const response = await axios.post("/api/code", { messages: newMessages });
      setMessages((current) => [...current, userMessage, response.data]);
      console.log(response.data)
      form.reset();
    } catch (error: any) {
      //TODO open pro model
      if(error?.response?.status == 403){
        proModel.onOpen();
      }else{
        toast.error("Something went wrong")
      }
    } finally {
      router.refresh()
    }
  }
  return (
    <div>
      <Heading
        title="Code Generation"
        description="Generate code using descriptive prompts."
        icon={Code}
        iconColor="text-green-700"
        bgColor="bg-green-500/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10 ">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder="Simple toggle button using react hooks."
                        {...field}
                      />
                    </FormControl>

                  </FormItem>
                )}
              />
              <Button className=" col-span-12 lg:col-span-2 w-full inline" disabled={isLoading}>
                Generate
              </Button>
            </form>
          </Form>
        </div>
        <div className="space-y-4 mt-4">
          {
            isLoading && (
              <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
                <Loader />
              </div>
            )
          }
          {
            messages.length === 0 && !isLoading && (
              <Empty label="No conservation started." />
            )
          }

          <div className="flex flex-col-reverse gap-y-4">
            {messages.map((message,i) => (
              <div 
              key={i}
                className={cn(
                  "p-8 w-full flex items-start gap-x-8 rounded-lg",
                  message.role === "user" ? "bg-white border border-black/10" : "bg-muted"
                )}
              >
                {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
               <ReactMarkdown 
               components={{
                pre:({ node, ...props}) => (
                  <div className="overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg">
                    <pre { ...props } />
                  </div>
                ),
                code: ({ node, ...props}) => (
                  <code className=" bg-black/20 p-1 rounded-lg"{...props}/> 
                ),
               }}
               className="text-sm leading-7 overflow-hidden"
               >
                {message.content || ""}
               </ReactMarkdown>

              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}

export default CodePage
