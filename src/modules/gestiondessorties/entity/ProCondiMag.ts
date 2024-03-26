import { IsAlpha, IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { CommandeClient } from "../../gestiondesclients/entity/CommandeClient";
import { Client } from "../../gestiondesclients/entity/Client";
import { ProCondiMagasin } from "../../gestiondesmagasins/entity/ProCondiMagasin";
import { Livraison } from "./Livraison";

@Entity()
export class ProCondiMag{
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    qtite:number

    @Column()
    qtiteRestante:number

    @ManyToOne(()=>Livraison, (livraison)=>livraison.procondimaglivraisons)
    @JoinColumn()
    livraison:Livraison[]

    @ManyToOne(()=>ProCondiMagasin, (magprocondi)=>magprocondi.magprocondis)
    @JoinColumn()
    magprocondi:ProCondiMagasin[]

    @CreateDateColumn()
    createdAt:Timestamp
    
    @UpdateDateColumn()
    updatedAt:Timestamp;

    @DeleteDateColumn()
    deletedAt:Timestamp;
}