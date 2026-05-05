import fastify from "fastify";
import cors from "@fastify/cors";

const server = fastify({ logger: true });

server.register(cors, {
  origin: "*",
});

const teams = [
  { id: 1, name: "McLaren", base: "Woking, United Kingdom" },
  { id: 2, name: "Mercedes", base: "Brackley, United Kingdom" },
  { id: 3, name: "Red Bull Racing", base: "Milton Keynes, United Kingdom" },
  { id: 4, name: "Ferrari", base: "Maranello, Italy" },
  { id: 5, name: "Alpine", base: "Enstone, United Kingdom" },
  { id: 6, name: "Aston Martin", base: "Silverstone, United Kingdom" },
  { id: 7, name: "Alfa Romeo Racing", base: "Hinwil, Switzerland" },
  { id: 8, name: "AlphaTauri", base: "Faenza, Italy" },
  { id: 9, name: "Williams", base: "Grove, United Kingdom" },
  { id: 10, name: "Haas", base: "Kannapolis, United States" },
];

const drivers = [
  { id: 1, name: "Max Verstappen", team: "Red Bull Racing" },
  { id: 2, name: "Lewis Hamilton", team: "Ferrari" },
  { id: 3, name: "Lando Norris", team: "McLaren" },
  { id: 4, name: "Charles Leclerc", team: "Ferrari" },
  { id: 5, name: "Oscar Piastri", team: "McLaren" },
  { id: 6, name: "George Russell", team: "Mercedes" },
  { id: 7, name: "Fernando Alonso", team: "Aston Martin" },
];

interface QueryParams {
  name?: string;
  team?: string;
}

server.get<{ Querystring: QueryParams }>("/teams", async (request) => {
  const { name } = request.query;

  let result = teams;

  if (name) {
    result = result.filter((t) =>
      t.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  return { teams: result };
});

server.get<{ Querystring: QueryParams }>("/drivers", async (request) => {
  const { name, team } = request.query;

  let result = drivers;

  if (name) {
    result = result.filter((d) =>
      d.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  if (team) {
    result = result.filter((d) =>
      d.team.toLowerCase().includes(team.toLowerCase())
    );
  }

  return { drivers: result };
});

server.get<{ Params: { id: string } }>("/drivers/:id", async (request, reply) => {
  const id = Number(request.params.id);

  const driver = drivers.find((d) => d.id === id);

  if (!driver) {
    reply.code(404);
    return { message: "Driver Not Found" };
  }

  const team = teams.find((t) => t.name === driver.team);

  return {
    driver,
    team,
  };
});

server.listen({ port: 3333 }, () => {
  console.log("Server init");
});
