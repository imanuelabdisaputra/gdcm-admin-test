"use client"

import { useForm, SubmitHandler } from "react-hook-form"
import supabase from '@/config/supabaseClient'
import { Button } from "@/components/ui/button"
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'

type Inputs = {
  name: string
  email: string
}

const User = () => {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    await supabase
    .from('users')
    .insert([
      { name: data.name, email: data.email },
    ])
    .select()
    router.push('/user')
  }

  return (
    <section className='container my-8'>
      <Card className="w-[350px] mx-auto">
        <CardHeader>
          <CardTitle>Tambah User</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='space-y-4'>
              <div className='space-y-1'>
                <Input {...register("name", { required: true })} placeholder='Nama' />
                {errors.name && <p>This field is required</p>}
              </div>

              <div className='space-y-1'>
                <Input {...register("email", { required: true })} placeholder='Email' />
                {errors.email && <p>This field is required</p>}
              </div>

              <div className="flex justify-between">
                <Button type='submit'>
                  Submit
                </Button>
                <Button variant={"secondary"} onClick={() => router.push('/user')}>
                  Back
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  )
}

export default User