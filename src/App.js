import { useEffect, useState } from "react";
import * as yup from 'yup';

const schema = yup.object().shape({
  fullName: yup
    .string()
    .min(5, 'Full name must be at least 5 characters')
    .max(20, 'Full name must be at most 20 characters')
    .required('Full name is required'),
  shirtSize: yup
    .string()
    .oneOf(['S', 'M', 'L'], 'Shirt size must be one of S, M, or L')
    .required('Shirt size is required'),
  animals: yup
    .array()
    .of(yup.string().oneOf(['1', '2', '3', '4']))
    .min(1, 'At least one valid animal is required')
    .required('Animals array is required'),
});

const initialFormValues = {
  fullName: "",
  shirtSize: "",
  animals: [],
};

const initialErrors = {
  fullName: '',
  shirtSize: '',
  animals: ''
}

const animals = [
  { animal_id: "1", animal_name: "dog" },
  { animal_id: "2", animal_name: "cat" },
  { animal_id: "3", animal_name: "bird" },
  { animal_id: "4", animal_name: "fish" },
];

function App() {
  const [formValues, setFormValues] = useState(initialFormValues);
  const [isDisabled, setIsDisabled] = useState(true);
  const [errors, setErrors] = useState(initialErrors);

  useEffect(() => {
    schema.isValid(formValues).then(valid => setIsDisabled(!valid));
  }, [formValues])

  useEffect(() => {
    yup.reach(schema, 'animals').validate(formValues.animals)
      .then(() => setErrors({...errors, animals: ''}))
      .catch((error) => setErrors({...errors, animals: error.errors[0]}))
  }, [formValues.animals])

  const handleTextChange = (e) => {
    const {value, name} = e.target;
    setFormValues({...formValues, [name]: value})
    yup.reach(schema, name).validate(value)
      .then(() => setErrors({...errors, [name]: ''}))
      .catch((error) => setErrors({...errors, [name]: error.errors[0]}))
  }

  const handleCheckboxChange = (e) => { // {fn: 'jacob', ss: 'M', animals: []}
    const {name, checked} = e.target; // {fn: 'jacob', ss: 'M', animals: ["1"]}
    if (checked) setFormValues({...formValues, animals: [...formValues.animals, name]});
    else setFormValues({...formValues, animals: formValues.animals.filter(a => a !== name)});
  }

  return (
    <form>
      <div>
        <input value={formValues.fullName} name="fullName" onChange={handleTextChange} />
        {errors.fullName && <p style={{color: 'red'}}>{errors.fullName}</p>}
      </div>
      <div>
        <select value={formValues.shirtSize} name="shirtSize" onChange={handleTextChange}>
          <option value=""></option>
          <option value="S">Small</option>
          <option value="M">Medium</option>
          <option value="L">Large</option>
        </select>
        {errors.shirtSize && <p>{errors.shirtSize}</p>}
      </div>
      {animals.map((animal) => (
        <div key={animal.animal_id}>
          <input
            type="checkbox"
            name={animal.animal_id}
            checked={formValues.animals.includes(animal.animal_id)}
            onChange={handleCheckboxChange}
          /> {animal.animal_name}
        </div>
      ))}
      {errors.animals && <p>{errors.animals}</p>}
      <button disabled={isDisabled}>Sumbit</button>
    </form>
  );
}

export default App;
