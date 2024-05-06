"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { NextUIProvider, Spinner } from "@nextui-org/react";
import CreateAppointment from "./components/CreateAppointment";


export default function AppoinmentApp() {
  const [value, setValue] = useState("");
  const [appointments, setAppointments] = useState([]);
  const supabase = createClient();

  const getData = async () => {
    const { data } = await supabase.from("appointments").select();
    setAppointments(data);
  };

  useEffect(() => {
    getData();
  }, []);

  const handleTitleChange = (e) => {
    setValue(e.target.value);
  };

  const handleAppointmentFormSubmit = (e) => {
    e.preventDefault();
    handleCreateAppointment();
  }

  const handleCreateAppointment = () => {
    const createData = async () => {
      const { data, error } = await supabase
      .from('appointments')
      .insert([
        { title: value, datetime: new Date() },
      ])
      .select()
      .single()

      if (error) {
        console.error(error);
        return;
      }
      console.log('data', data);
      appointments.push(data);
      setAppointments([...appointments]);
      setValue("");
    }

    createData();

  };

  const handleApoinementDelete = () => {
    if (!value) {
      console.error('value should not be falsey')
      return;
    }
    const deleteData = async () => {
    const { data, error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', value)
      if (error) {
        console.error(error);
        return;
      }
      console.log('handleApoinementDelete  data', data);
      console.log(appointments.filter(a => a.id !== Number(value)), value)
      setAppointments(appointments.filter(a => a.id !== Number(value)))
    }
    deleteData();
  }

  return (
    <NextUIProvider>
      <h1 className="text-2xl my-5">Appoinments</h1>
      <CreateAppointment
        value={value}
        onChange={handleTitleChange}
        onSubmit={handleAppointmentFormSubmit}
        onDelete={handleApoinementDelete}
      />
       {Array.isArray(appointments) && appointments.length? <pre>{JSON.stringify(appointments.sort((a, b) => b.id - a.id), null, 2)}</pre>: <Spinner /> }
    </NextUIProvider>
  );
}
