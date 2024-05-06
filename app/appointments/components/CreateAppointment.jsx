import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/react";

export default function CreateAppointment({ value, onChange, onSubmit, onDelete }) {
  return (
    <form onSubmit={onSubmit}>
      <div>
        <Input value={value} onChange={onChange} variant="bordered"/>
      </div>
      <Button className="my-3" variant="bordered" type="submit">Create</Button>
      <Button variant="bordered" className="mx-3"  color="danger" onClick={onDelete}>Delete</Button>

      <footer>
        ** create appointment by using title, and delete item by id
      </footer>
    </form>
  );
}
