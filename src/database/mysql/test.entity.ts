import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
} from "typeorm"

@Entity("test")
export class TestEntity {
    @PrimaryGeneratedColumn("uuid")
	    testId: string

    @Column({ type: "varchar", length: 1000, nullable: true })
	    message: string
}