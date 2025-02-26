"use server"

export default async function Home() {
  const persons = ['mama', 'papa']
  return (
    <div>
        {persons.map((person, index) => (<p key={index}>{person}</p>))}
    </div>
  );
}
