import { context, u128, PersistentVector, PersistentMap, logging, ContractPromiseBatch, RNG} from "near-sdk-as";
import {Vector} from './models';
/** 
 * Exporting a new class Game so it can be used outside of this file.
 */
@nearBindgen
class Project {
    id: u32;
    address: string;
    name: string;
    funds: u128;

    constructor(_address: string, _funds: u128, _name: string) {
        const rng = new RNG<u32>(1, u32.MAX_VALUE);
        const roll = rng.next();
        this.id = roll;
        this.address = _address;
        this.name = _name;
        this.funds = _funds;
    }
}

@nearBindgen
export class NGO {
    id: u32;
    address: string;

    constructor() {
        /*
        Generates a random number for the gameId.
        Need to change this to counter eventually.
        */
        const rng = new RNG<u32>(1, u32.MAX_VALUE);
        const roll = rng.next();
        this.id = roll;
        this.address = context.sender;
        
    }

}

export const ngoList = new PersistentMap<u32, NGO>("n");
export const ngoIdList = new PersistentVector<u32>("nl");
export const projects = new PersistentMap<u32, Project>("p")
export const ngoProjectMap = new PersistentMap<u32, PersistentMap<u32, Project>>("np");
export const projectIdList = new PersistentVector<u32>("pl");

export function registerNGO(): u32 {
  const ngo = new NGO();
  ngoList.set(ngo.id,ngo);
  ngoIdList.push(ngo.id);
  return ngo.id;
}

export function addProject(ngoId: u32, address: string, name: string, funds: string): u32{
    const ngoInstance = ngoList.getSome(ngoId);
    //logging.log("Thee value of array is: " + ngoIdList.toString());
    //logging.log("NGO ID is: " + ngoId);
    logging.log("Project Name is: " + name);
    logging.log("Project Address is: " + address);
    logging.log("Funds are: " + funds);
    const funds_u128 = u128.from(funds);
    const newProject = new Project(address, funds_u128, name);
    //logging.log("NGO Instance is" + ngoInstance.address.toString);
    if(ngoInstance!=null){
        logging.log("NGO Instance is not null");
        projects.set(newProject.id, newProject);
        ngoProjectMap.set(ngoId, projects);
        projectIdList.push(newProject.id);

        return newProject.id;
    }
    else{
      return 0;
      //Show message that NGO doesn't exist
    }

    return 0;

}

/*
return the list of NGOs registered
 */
export function getNGO(): Array<u32> {
    let ngos = new Array<u32>();
    
    for(let i=0;i<ngoIdList.length;i++)
    {  
      logging.log("The value of length of ngoIdList is" + ngoIdList.length.toString());
       ngos.push(ngoIdList[i]);
    }
    return ngos;
}

export function getProjects(ngoId:u32):Array<u32> {
    logging.log("Trying to get Projects")
    const projectList = new Array<u32>();
    const projectsNgo = ngoProjectMap.getSome(ngoId);
    for(let i=0;i<projectIdList.length;i++){
      logging.log("The value of length of ProjectIdList is" + projectIdList.length.toString());
      if (projectsNgo.contains(projectIdList[i])){
        projectList.push(projectIdList[i]);
      }
    }
    return projectList;
    
}

export function donate(ngoId:u32,projectId:u32): string
{
    for(let i=0;i<ngoIdList.length;i++){
      if(ngoList.contains(ngoId)){
      const projects = ngoProjectMap.getSome(ngoId);
      const project = projects.getSome(projectId);

      project.funds = u128.sub(project.funds, context.attachedDeposit);
      projects.set(project.id, project);
      ngoProjectMap.set(ngoId, projects);
      const to_beneficiary = ContractPromiseBatch.create(project.address);
      to_beneficiary.transfer(context.attachedDeposit);
      return "Done";
    }
  }
  return "Could Not Complete";
}




//getNGO() --> It will list all the NGOs and the projects by returning the list 
//getProjects(ngoId) --> It will return the projects 
//donate(projectId,amount) --> it will update the project by reducing the amount 
                            //from the total funds needed and transfer it to the projet wallet
                            // suppose if someone has donated the total fund needed then it will delete that project from the NGOs list
//if extra needed the donor profile 
    //DonorClass--> id, map --> <transactions url -- amount>  
                //-->claim taxcertficate (json--> with amount donated)            