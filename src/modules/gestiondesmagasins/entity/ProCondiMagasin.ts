import { IsAlpha, IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { Magasin } from "./Magasin";
import { ProduitConditionnement } from "../../gestiondesconditionnements/entity/ProduitConditionnement";
import { ProCondiMagInventaire } from "./ProCondiMagInventaire";
import { ProCondiMag } from "../../gestiondessorties/entity/ProCondiMag";
import { SortieProCondi } from "../../gestiondessorties/entity/SortieProCndi";

@Entity()
export class ProCondiMagasin{
    @PrimaryGeneratedColumn()
    id:number

    @Column({nullable:false})
    @IsNotEmpty({message:"La quantité ne peut pas être nulle"})
    qtite:number

    @ManyToOne(()=>Magasin, (magasin)=>magasin.magasinprocondis)
    @JoinColumn()
    magasin:Magasin[]

    @ManyToOne(()=>ProduitConditionnement, (produitcondi)=>produitcondi.procondiaprovisions)
    @JoinColumn()
    produitcondi:ProduitConditionnement[]

    @OneToMany(() => ProCondiMagInventaire, (procondimaginventaire) => procondimaginventaire.procondimag)
    procondimaginventaires: ProCondiMagInventaire[]
    
    @OneToMany(() => ProCondiMag, (magprocondi) => magprocondi.magprocondi)
    magprocondis: ProCondiMag[]
    
    @OneToMany(() => SortieProCondi, (sortieprocondi) => sortieprocondi.magprocondi)
    sortieprocondis: SortieProCondi[]
    
    @CreateDateColumn()
    createdAt:Timestamp
    
    @UpdateDateColumn()
    updatedAt:Timestamp;

    @DeleteDateColumn()
    deletedAt:Timestamp;
}