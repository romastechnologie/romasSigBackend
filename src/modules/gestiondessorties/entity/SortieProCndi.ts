import { IsAlpha, IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { ProCondiMagasin } from "../../gestiondesmagasins/entity/ProCondiMagasin";
import { Sortie } from "./Sortie";

@Entity()
export class SortieProCondi{
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    qtite:number

    @Column()
    prixProd:number

    @ManyToOne(()=>Sortie, (livraison)=>livraison.sortiprocondis)
    @JoinColumn()
    sortie:Sortie[]

    @ManyToOne(()=>ProCondiMagasin, (magprocondi)=>magprocondi.sortieprocondis)
    @JoinColumn()
    magprocondi:ProCondiMagasin[]

    @CreateDateColumn()
    createdAt:Timestamp
    
    @UpdateDateColumn()
    updatedAt:Timestamp;

    @DeleteDateColumn()
    deletedAt:Timestamp;
}