"use client"

import { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import supabase from '@/config/supabaseClient'
import { toast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import { useProfile } from '@/store/useProfile'
import { Button } from '@/components/ui/button'

interface IForm {
  name: string
  phone: string
}

const Profile = () => {
  const router = useRouter()
  const { getUser, profile } = useProfile()

  const {
    handleSubmit,
    register,
    setValue,
  } = useForm<IForm>()

  const onSubmit: SubmitHandler<IForm> = async (val) => {
    console.log(val)
    const { data, error } = await supabase.auth.updateUser({
      phone: val.phone,
      data: { name: val.name }
    })
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error: " + error.message,
      })
    }
    if (data) {
      // router.push("/")
      console.log(data)
    }
    console.log(error)
  }

  useEffect(() => {
    getUser()
    setValue('name', profile.user_metadata.name)
    setValue('phone', profile.phone)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  

  return (
    <form className='space-y-3' onSubmit={handleSubmit(onSubmit)}>
      <Input
        {...register('name')}
        label="Nama"
        placeholder='Masukan Nama'
      />
      <Input
        {...register('phone')}
        label="No Telepon"
        placeholder='Masukan No Telepon'
      />
      <Button type='submit'>
        Submit
      </Button>
    </form>
  )
}

export default Profile