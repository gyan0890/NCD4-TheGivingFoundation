import {
  registerNGO,
  addProject,
  getNGO,
  getProjects,
  donate
} from "../assembly";
import { VMContext, VM, u128 } from "near-sdk-as";

describe("NGO project Happy Paths", () => {
  

  it("should register an NGO using registerNGO()", () => {
    const ngo = registerNGO();
    expect(ngo).toBeTruthy();
  });

  it("should add a Project", () => {
    const ngo = registerNGO();
    const project = addProject(ngo, "gyanlakshmi.testnet", "Book Drive", "10000000000000000000000000");
    expect(project).toBeTruthy();
  });

  it("should get all the 3 registered NGOs", () => {
    const ngo = registerNGO();
    const ngo1 = registerNGO();
    const ngo2 = registerNGO();
    const ngoArray = getNGO();
    expect(ngoArray).toHaveLength(3);
  });

  it("should get all the projects", () => {
    const ngo = registerNGO();
    const project = addProject(ngo, "gyanlakshmi.testnet", "Book Drive", "10000000000000000000000000");
    const project1 = addProject(ngo, "gyanlakshmi.testnet", "Book Drive", "10000000000000000000000000");
    const project2 = addProject(ngo, "gyanlakshmi.testnet", "Book Drive", "10000000000000000000000000");
    const projects = getProjects(ngo);
    expect(projects).toHaveLength(3);
  });
});

describe("NGO project Sad Paths", () => {
  throws("to return the failure of project addition", () => {
    const ngo = registerNGO();
    const project = addProject(50, "gyanlakshmi.testnet", "Book Drive", "10000000000000000000000000");
  });

});
