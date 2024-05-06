"use client";

import 'react-toastify/dist/ReactToastify.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { NextUIProvider, Spinner } from "@nextui-org/react";
import { ToastContainer, toast } from 'react-toastify';
import CreateAppointment from "./components/CreateAppointment";
import { useRouter } from "next/navigation";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';

const localizer = momentLocalizer(moment);

const mappedData = data => data.map(appt => ({
  id: appt.id,
  title: appt.title,
  start: new Date(appt.datetime),
  end: new Date(new Date(appt.datetime).getTime() + appt.time_span * 60000), // assuming time_span is in minutes
  description: appt.description
}));

export default function AppoinmentPage() {
  const router = useRouter()
  const [value, setValue] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [currentView, setCurrentView] = useState('day');

  const handleViewChange = (view) => {
    console.log('handleViewChange',  view);
    setCurrentView(view);
  };

  const supabase = createClient();

  const getData = async () => {
    const { data } = await supabase.from("appointments").select();
    setAppointments(data);
  };

  const getUser = async()  =>  {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    console.log('user', user);
    if (!user) {
      router.push("/login");
    }
  }

  useEffect(() => {
    getUser().then(() => {
      getData();
    }).catch(e => {
      console.error(e);
    })
    toast("Welcome!");
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
      <CreateAppointment
        value={value}
        onChange={handleTitleChange}
        onSubmit={handleAppointmentFormSubmit}
        onDelete={handleApoinementDelete}
      />
      <Calendar
        onView={handleViewChange}
        view={currentView}
        localizer={localizer}
        events={mappedData(appointments)}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        onSelectEvent={event => alert(`${event.title} at ${event.start.toLocaleTimeString()}`)}
      />
       {Array.isArray(appointments) && appointments.length? <pre>{JSON.stringify(appointments.sort((a, b) => b.id - a.id), null, 2)}</pre>: <Spinner /> }
       <ToastContainer />
    </NextUIProvider>
  );
}
