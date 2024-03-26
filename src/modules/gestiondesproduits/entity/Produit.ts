import { IsAlpha, IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { Famille } from "./Famille";
import { ProduitConditionnement } from "../../gestiondesconditionnements/entity/ProduitConditionnement";


@Entity()
export class Produit{
    @PrimaryGeneratedColumn()
    id:number
    
    @Column({unique: true})
    refProd:string

    @Column()
    @IsAlpha()
    nomProd:string

    @Column()
    @IsAlpha()
    marqProd:string

    @Column()
    @IsAlpha()
    modeleProd:string

    @Column()
    @IsAlpha()
    descProd:string

    @Column()
    estTaxable:boolean

    @Column()
    estService:boolean

    @OneToMany(() => ProduitConditionnement, (produitconditionnement) => produitconditionnement.produit)
    produitconditionnements: ProduitConditionnement[]

    @Column()
    codeQR:number

    @Column()
    codeBarre:number
    
    @ManyToOne(()=>Famille, (famille)=>famille.produits)
    @JoinColumn()
    famille:Famille[]
    
    @Column()
    seuilAppro:number

    @Column()
    seuilAlerte:number

    @CreateDateColumn()
    createdAt:Timestamp
    
    @UpdateDateColumn()
    updatedAt:Timestamp;

    @DeleteDateColumn()
    deletedAt:Timestamp;
}