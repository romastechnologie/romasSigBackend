import { IsAlpha, IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { Magasin } from "./Magasin";
import { ProduitConditionnement } from "../../gestiondesconditionnements/entity/ProduitConditionnement";
import { ProCondiMagInventaire } from "./ProCondiMagInventaire";
import { AProCondi } from "../../gestiondesapprovisionnements/entity/AProCondi";

@Entity()
export class ApropoCondiMagasin{
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    qtite:number

    @ManyToOne(()=>Magasin, (magasin)=>magasin.magasinaprocondis)
    @JoinColumn()
    magasin:Magasin[]

    @ManyToOne(()=>AProCondi, (aprocondi)=>aprocondi.aprocondimagasins)
    @JoinColumn()
    aprocondi:AProCondi[]
    
    @CreateDateColumn()
    createdAt:Timestamp
    
    @UpdateDateColumn()
    updatedAt:Timestamp;

    @DeleteDateColumn()
    deletedAt:Timestamp;
}