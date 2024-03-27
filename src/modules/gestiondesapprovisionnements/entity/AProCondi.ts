import { IsAlpha, IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { ProduitConditionnement } from "../../gestiondesconditionnements/entity/ProduitConditionnement";
import { Approvisionnement } from "./Approvisionnement";
import { ApropoCondiMagasin } from "../../gestiondesmagasins/entity/ApropoCondiMagasin";

@Entity()
export class AProCondi{
    @PrimaryGeneratedColumn()
    id:number

    @Column({nullable:false})
    @IsNotEmpty({message:"Le montant est obligatoire."})
    montant:number

    @Column({nullable:false})
    @IsNotEmpty({message:"La quantité est obligatoire."})
    qtité:number

    @ManyToOne(()=>ProduitConditionnement, (produitcondi)=>produitcondi.aprocondis)
    @JoinColumn()
    produitcondi:ProduitConditionnement[]

    @ManyToOne(()=>Approvisionnement, (approvision)=>approvision.apropocondis)
    @JoinColumn()
    approvision:Approvisionnement[]

    @OneToMany(() => ApropoCondiMagasin, (aprocondimagasin) => aprocondimagasin.aprocondi)
    aprocondimagasins: ApropoCondiMagasin[]

    @CreateDateColumn()
    createdAt:Timestamp
    
    @UpdateDateColumn()
    updatedAt:Timestamp;

    @DeleteDateColumn()
    deletedAt:Timestamp;
}