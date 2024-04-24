import { IsAlpha, IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { Inventaire } from "./Inventaire";
import { ProCondiMagasin } from "./ProCondiMagasin";

@Entity()
export class ProCondiMagInventaire{
    @PrimaryGeneratedColumn()
    id:number

    @Column({nullable:false})
    dateDebut:Date

    @ManyToOne(()=>ProCondiMagasin, (procondimag)=>procondimag.procondimaginventaires)
    @JoinColumn()
    procondimag:ProCondiMagasin[]

    @ManyToOne(()=>Inventaire, (inventaire)=>inventaire.inventaiprocondimags)
    @JoinColumn()
    inventaire:Inventaire[]
    
    @CreateDateColumn()
    createdAt:Timestamp
    
    @UpdateDateColumn()
    updatedAt:Timestamp;

    @DeleteDateColumn()
    deletedAt:Timestamp;
}